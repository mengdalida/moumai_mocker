import base64
import gzip
import urllib.parse
import json

# 第一段response报文
str = ""

# 获取用户输入
input_string = str

# 截取&之前的字符串
index = input_string.find('&')
if index != -1:
    input_string = input_string[:index]

# 进行URL解码
decoded_string = urllib.parse.unquote(input_string)

# 输出结果
print("解码后的字符串：", decoded_string)

# 获取用户输入的JSON字符串
input_json = decoded_string

try:
    # 解析JSON字符串
    data = json.loads(input_json.replace("data=", ""))

    # 获取params字段的值
    params = data.get("params")

    if params is not None:
        print("params字段的值：", params)
    else:
        print("JSON字符串中不存在params字段")

except json.JSONDecodeError:
    print("输入的字符串不是有效的JSON格式")

decode_data = base64.b64decode(params.replace("\\n", ""))
decompressed_data = gzip.decompress(decode_data).decode("utf-8")

print("解码后")
print(json.dumps(json.loads(decompressed_data), sort_keys=True))
