(function(){
    angular.module('intouch').controller('EditProfileController', function($state, $scope, $http, UserService, HttpHelperService, AppConfigService){
        var url = 'http://www.intouch.pro/api/user/get_user_details_by_id/';
        var locallyStoredId = localStorage.getItem('INTOUCH_USER_ID');
        if (locallyStoredId) {
            UserService.setUserId(locallyStoredId);
        } else {
            $state.go('login');
            return;
        }
        var userId = UserService.getUserId();
        var data = {
          id: userId
        };

        $scope.userDetails = "";
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.name = response.data.name;
                    $scope.mobile = response.data.mobile;
                    $scope.new_password = '';
                    $scope.confirm_password = '';
                    $scope.$apply();
                }
            },
            error: function() {
                debugger;
            },
            headers : HttpHelperService.getHeaders(),
            dataType: 'json'
        });

        $scope.updateProfile = function(){
            var data = {
                user_id: userId,
                name: $scope.name,
                mobile: $scope.mobile,
                new_password: $scope.new_password,
                confirm_password: $scope.confirm_password,
                profile_photo: '',
                profile_photo_file: '',
                device_id: AppConfigService.getDeviceId(),
            };
            $.ajax({
                type: "POST",
                url: 'http://www.intouch.pro/api/user/edit_profile/',
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        $scope.success_msg  = response.data.success_msg;
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
                },
                error: function() {
                    debugger;
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        };

        $scope.goToProfile = function() {
            $state.go('profile');
        };
        $scope.goToActivities = function() {
            $state.go('profile.activities');
        };
    });
})();
