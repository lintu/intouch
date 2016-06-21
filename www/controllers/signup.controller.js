(function(){
    angular.module('intouch').controller('SignUpController', function($state, $scope, $http, UserService, HttpHelperService, AppConfigService){

    	$scope.signupSubmit = function(){
            var data = {
                name: $scope.name,
                email: $scope.email,
                mobile: $scope.mobile,
                password: $scope.password,
                device_id: AppConfigService.getDeviceId()
            };

            signupBu = angular.element(document.querySelector('.signupBu'));
            signupBu.html('Loading..').attr('disabled','disabled');
            $.ajax({
                type: "POST",
                url: 'http://www.intouch.pro/api/guest/signup/',
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        $scope.success_msg  = response.data.success_msg;
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
                    signupBu.html('SIGN UP').removeAttr('disabled');
                },
                error: function() {
                    debugger;
                },
                headers : {
                    'APPID': AppConfigService.getAppId()
                },
                dataType: 'json'
            });
        };

        $scope.login = function() {
            $state.go('login');
        }

    });
})();
