Java.perform(function () {
    var SwitchConfig = Java.use('mtopsdk.mtop.global.SwitchConfig')
    var config = SwitchConfig.getInstance();
    config.setGlobalSpdySslSwitchOpen(false);
    config.setGlobalSpdySwitchOpen(false);
});