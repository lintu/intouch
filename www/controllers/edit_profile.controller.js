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

        $scope.userDetails = userDetails;
        $scope.name = userDetails.name;
        $scope.mobile = userDetails.mobile;
        $scope.new_password = '';
        $scope.confirm_password = '';        

        $scope.updateProfile = function(){
            var data = {
                user_id: userId,
                name: $scope.name,
                mobile: $scope.mobile,
                new_password: $scope.new_password,
                confirm_password: $scope.confirm_password,
                profile_photo: $('#profilePicName').val(),
                profile_photo_file:  $('#profilePicVal').val(),
                device_id: AppConfigService.getDeviceId(),
            };
            saveBtn = angular.element(document.querySelector('.saveBu'));
            saveBtn.html('Loading..').attr('disabled','disabled');
            $.ajax({
                type: "POST",
                url: 'http://www.intouch.pro/api/user/edit_profile/',
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        getuserDetails(userId,HttpHelperService.getHeaders(),false);
                        getActivityList(userId,HttpHelperService.getHeaders(),true);
                        $scope.success_msg  = response.data.success_msg;
                        $state.go('profile.activities');
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
                    saveBtn.html('SAVE').removeAttr('disabled');
                },
                error: function() {
                    alert('Error occured, plz try again.');
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
