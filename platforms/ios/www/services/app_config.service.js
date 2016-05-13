(function(){
    angular.module('intouch').service('AppConfigService', function(){
        var appId = '6639fe9c25557488afc65826442effb1d191dddd';
        var deviceId = '2';


        this.getAppId = function() {
            return appId;
        };

        this.getDeviceId = function(){
            return deviceId;
        }
    });
})();

