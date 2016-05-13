(function(){
    angular.module('intouch').service('HttpHelperService', function(AppConfigService){

        var headers = {};
        headers.APPID = AppConfigService.getAppId();

        headers.DEVICEID = AppConfigService.getDeviceId();
        this.setAccessToken = function(accessToken) {
            headers.ACCESSTOKEN = accessToken;
        };
        this.getHeaders = function() {
            if(!headers.ACCESSTOKEN && sessionStorage.getItem('INTOUCH_ACCESS_TOKEN')) {
                headers.ACCESSTOKEN = sessionStorage.getItem('INTOUCH_ACCESS_TOKEN');
            }
            return headers;
        }

    });
})();

