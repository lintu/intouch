(function(){
    angular.module('intouch').controller('LoginController', function($state, $scope, $http, UserService, HttpHelperService, AppConfigService){
        /*$scope.username = 'srijithvr@gmail.com';
        $scope.password = '123456';*/
        $scope.errorArr = [];
        $scope.login = function(){
            var data = {
                login_email: $scope.username,
                login_password: $scope.password,
                device_id: AppConfigService.getDeviceId()
            };
            loginSubmit(data);
            
        };

        loginBu = angular.element(document.querySelector('.loginBu'));

        function loginSubmit(data){
            loginBu.html('Loading..').attr('disabled','disabled');
            $.ajax({
                type: "POST",
                url: 'http://www.intouch.pro/api/guest/login/',
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        sessionStorage.setItem('INTOUCH_ACCESS_TOKEN', response.data.access_token);
                        HttpHelperService.setAccessToken(response.data.access_token);
                        fetchUserDetails();
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                        $scope.$apply();
                        loginBu.html('Login').removeAttr('disabled');
                    }
                },
                error: function(xhr, status, error) {
                  alert('Error occured, plz try again.');
                },
                headers : {
                    'APPID': AppConfigService.getAppId()
                },
                dataType: 'json'
            });



        }

        function fetchUserDetails() {
            var locallyStoredEmail = localStorage.getItem('INTOUCH_EMAIl_ID');
            if(locallyStoredEmail === $scope.username) {
                var locallyStoredId = localStorage.getItem('INTOUCH_USER_ID');
                if (locallyStoredId) {
                    UserService.setUserId(locallyStoredId);
                    get_user_arr(locallyStoredId);
                    $state.go('profile.activities');
                    return;
                }
            }
            $.ajax({
                type: "POST",
                url: 'http://www.intouch.pro/api/user/get_user_details_by_access_token/',
                data: {'access_token': sessionStorage.getItem('INTOUCH_ACCESS_TOKEN'), 'device_id': AppConfigService.getDeviceId()},
                success: function(response){
                    if(response.data && response.data.user_arr.length > 0) {
                        //set user id
                        var userDetails = response.data.user_arr[0];
                        UserService.setUserId(userDetails.id);
                        localStorage.setItem('INTOUCH_EMAIl_ID', userDetails.email);
                        localStorage.setItem('INTOUCH_USER_ID', userDetails.id);
                        get_user_arr(userDetails.id);
                        $state.go('profile.activities');
                    } else {
                        alert('Failed to fetch user details');
                    }
                },
                error: function() {
                    alert('Error occured, plz try again.');
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        }

        function get_user_arr(userId){
            getuserDetails(userId,HttpHelperService.getHeaders(),false);
            getActivityList(userId,HttpHelperService.getHeaders(),true);
            getContactList(userId,HttpHelperService.getHeaders(),true);
            getContactRankingList(userId,HttpHelperService.getHeaders(),true);
            getContactStatusList(userId,HttpHelperService.getHeaders(),true);
            getDateList(userId,HttpHelperService.getHeaders(),true);
            getRankingList(userId,HttpHelperService.getHeaders(),true);
            getStatusList(userId,HttpHelperService.getHeaders(),true);
            getFollowupList(userId,HttpHelperService.getHeaders(),true);
            getHourList(userId,HttpHelperService.getHeaders(),true);
            getMinuteList(userId,HttpHelperService.getHeaders(),true);
            loginBu.html('Login').removeAttr('disabled');
        }

        $scope.signup = function(){

            //TODO
            //request login api
            // validate and navigate to profile page
            $state.go('signup');
        };

    });
})();
