import base64
import gzip
import json
import time

import frida
import requests

# 从文件中读取 JavaScript 代码
with open('reqeust.js', 'r', encoding='utf-8') as file:
    js_code = file.read()

# 用于连接手机
frida_process = None


# 根据第一段请求，更新响应字段
def update_map_fields(datas):
    # 去除无用字段
    datas["container"] = None

    data_map = datas["data"]
    for key, value in data_map.items():
        if key.startswith("dmViewer_"):
            if "fields" in value:
                fields = value["fields"]
                if "selectedNum" in fields and "buyerTotalNum" in fields:
                    fields["selectedNum"] = fields["buyerTotalNum"]
                if "viewerList" in fields:
                    viewer_list = fields["viewerList"]
                    buyer_total_num = int(fields["buyerTotalNum"])
                    for i in range(buyer_total_num):
                        item = viewer_list[i]
                        if "isUsed" in item:
                            item["isUsed"] = "true"
                        item["used"] = True
    return datas


# 生成第二段响应
def compress_data(params):
    compressed_data = json.dumps(params).encode("utf-8")
    compressed_data = gzip.compress(compressed_data)
    params = base64.b64encode(compressed_data).decode("utf-8")

    return '''{"feature":"{\\"gzip\\":\\"true\\"}","params":"''' + params + '"}'


# 发送第一段请求
def on_message1(message, data):
    if message["type"] == "send":
        request_map = json.loads(message["payload"])
        print("round1 request data: " + message["payload"])

        response = requests.post(request_map["url"], headers=request_map["headers"],
                                 data=bytes(request_map["body"]["content"]))
        # 获取响应内容
        content = response.text
        # 打印响应内容
        print("response data:" + content)
        response = json.loads(content)
        response_data = response["data"]
        print(update_map_fields(response_data))
        round2_request = compress_data(update_map_fields(response_data))
        print("compress_data")
        print(round2_request)
        global js_code
        round2_data = "var data=`" + round2_request.replace('"',
                                                            '\\"') + "`;\nvar apiName=\"mtop.trade.order.create\";\n"
        print(round2_data)
        start_hook(round2_data + js_code, on_message2)
    else:
        print(message)


# 发送第二段请求
def on_message2(message, data):
    if message["type"] == "send":
        request_map = json.loads(message["payload"])
        print("round2 request data: " + message["payload"])

        # request_map["url"].replace("https","http")
        response = requests.post(request_map["url"].replace("https", "http"), headers=request_map["headers"],
                                 data=bytes(request_map["body"]["content"]))
        # 获取响应内容
        content = response.text
        # 打印响应内容
        print("response data:" + content)
        print("response header:" + str(response.headers))
    else:
        print(message)


# 开始监听
def start_hook(code, func):
    global frida_process
    if not frida_process:
        frida_process = frida.get_usb_device(1000).attach("大麦")

    script = frida_process.create_script(code)
    script.on("message", func)
    script.load()


if __name__ == "__main__":
    raw_data = r'{"buyNow":"true","buyParam":"730378856886_2_5232282310547","exParams":"{\"UMPCHANNEL_DM\":\"10001\",\"UMPCHANNEL_TPP\":\"50053\",\"atomSplit\":\"1\",\"channel\":\"damai_app\",\"coVersion\":\"2.0\",\"coupon\":\"true\",\"seatInfo\":\"\",\"subChannel\":\"\",\"umpChannel\":\"10001\",\"websiteLanguage\":\"zh_CN\"}"}'
    round1_data = 'var data="' + raw_data.replace('\\', '\\\\').replace('"',r'\"') + '";\nvar apiName="mtop.trade.order.build";\n'
    process = start_hook(round1_data + js_code, on_message1)

    # 需要等待其他进程结束
    time.sleep(10)
