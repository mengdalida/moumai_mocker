//这两行数据由python生成
//var data="{\"buyNow\":\"true\",\"buyParam\":\"730378856886_2_5232282310547\",\"exParams\":\"{\\\"UMPCHANNEL_DM\\\":\\\"10001\\\",\\\"UMPCHANNEL_TPP\\\":\\\"50053\\\",\\\"atomSplit\\\":\\\"1\\\",\\\"channel\\\":\\\"damai_app\\\",\\\"coVersion\\\":\\\"2.0\\\",\\\"coupon\\\":\\\"true\\\",\\\"seatInfo\\\":\\\"\\\",\\\"subChannel\\\":\\\"\\\",\\\"umpChannel\\\":\\\"10001\\\",\\\"websiteLanguage\\\":\\\"zh_CN\\\"}\"}";
//var apiName="mtop.trade.order.build";

Java.perform(function () {
    function HashMap2Str(params_hm) {
          var HashMap=Java.use('java.util.HashMap');
          var args_map=Java.cast(params_hm,HashMap);
          return args_map.toString();
      };
    const MtopRequest = Java.use("mtopsdk.mtop.domain.MtopRequest");
    let myMtopRequest = MtopRequest.$new();
    myMtopRequest.setApiName(apiName);
    //item_id + count + ski_id  716435462268_1_5005943905715
    console.log(apiName + "data: "+data )
    myMtopRequest.setData(data)
    myMtopRequest.setNeedEcode(true);
    myMtopRequest.setNeedSession(true);
    myMtopRequest.setVersion("4.0");

     //引入Java中的类
	const MtopBusiness = Java.use("com.taobao.tao.remotebusiness.MtopBusiness");
	const MtopBuilder = Java.use("mtopsdk.mtop.intf.MtopBuilder");
	// let RemoteBusiness = Java.use("com.taobao.tao.remotebusiness.RemoteBusiness");
	const MethodEnum = Java.use("mtopsdk.mtop.domain.MethodEnum");
	const MtopListenerProxyFactory = Java.use("com.taobao.tao.remotebusiness.listener.MtopListenerProxyFactory");
	const System = Java.use('java.lang.System');
	const ApiID = Java.use("mtopsdk.mtop.common.ApiID");
	const MtopStatistics = Java.use("mtopsdk.mtop.util.MtopStatistics");
	const InnerProtocolParamBuilderImpl = Java.use('mtopsdk.mtop.protocol.builder.impl.InnerProtocolParamBuilderImpl');
	const MtopResponse=Java.use('mtopsdk.mtop.domain.MtopResponse');
    const Gson = Java.use('com.google.gson.Gson').$new();
	const InnerNetworkConverter=Java.use('mtopsdk.mtop.protocol.converter.impl.InnerNetworkConverter');
	const MTop=Java.use('mtopsdk.mtop.intf.Mtop')
	const InnerFilterManagerImpl=Java.use('mtopsdk.framework.manager.impl.InnerFilterManagerImpl')


	let myMtop = MTop.instance(null);

	let myMtopBusiness = MtopBusiness.$new(myMtop,myMtopRequest,null);
	myMtopBusiness.useWua();
	myMtopBusiness.reqMethod(MethodEnum.POST.value);
	myMtopBusiness.setCustomDomain("mtop.damai.cn");
	myMtopBusiness.setBizId(24);
	myMtopBusiness.setErrorNotifyAfterCache(true);
	myMtopBusiness.reqStartTime = System.currentTimeMillis();
	myMtopBusiness.isCancelled = false;
	myMtopBusiness.isCached = false;
	myMtopBusiness.clazz = null;
	myMtopBusiness.requestType = 0;
	myMtopBusiness.requestContext = null;
	myMtopBusiness.mtopCommitStatData(false);
	myMtopBusiness.sendStartTime = System.currentTimeMillis();
    myMtopBusiness.mtopInstance.value.getMtopConfig().filterManager=InnerFilterManagerImpl.$new();

	let createListenerProxy = myMtopBusiness.$super.createListenerProxy(myMtopBusiness.$super.listener.value);
	let createMtopContext = myMtopBusiness.createMtopContext(createListenerProxy);
	let myMtopStatistics = MtopStatistics.$new(null, null); //创建一个空的统计类
	createMtopContext.stats.value = myMtopStatistics;
	myMtopBusiness.$super.mtopContext.value = createMtopContext;
	createMtopContext.apiId.value = ApiID.$new(null, createMtopContext);

	let myMtopContext = createMtopContext;
	myMtopContext.mtopRequest.value = myMtopRequest;
	let myInnerProtocolParamBuilderImpl = InnerProtocolParamBuilderImpl.$new();
	let res = myInnerProtocolParamBuilderImpl.buildParams(myMtopContext);
//	console.log(`myInnerProtocolParamBuilderImpl.buildParams => ${HashMap2Str(res)}`)

	myMtopContext.protocolParams.value=res


    let myInnerNetworkConverter =InnerNetworkConverter.$new();

    myMtopContext.networkRequest.value=myInnerNetworkConverter.convert(myMtopContext)
    // 将结果发送给 Frida Python 脚本
    send(Gson.toJsonTree(myMtopContext.networkRequest.value).getAsJsonObject().toString());


});
