(function(){
    angular.module('intouch').controller('ProfileController', function($state, $scope, $http, UserService, HttpHelperService){
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
                    $scope.userDetails = response.data;
                    $scope.$apply();
                    //var a = navigator.contacts;
                }
            },
            error: function() {
                debugger;
            },
            headers : HttpHelperService.getHeaders(),
            dataType: 'json'
        });

        $scope.editProfile = function(){
            $state.go('editProfile');
        }
        $scope.logout = function() {
            $state.go('login');
        }
        $scope.goToContacts = function() {
            $state.go('profile.contacts');
        };
        $scope.goToActivities = function() {
            $state.go('profile.activities');
        };
        $scope.goToEvents = function() {
            $state.go('profile.events');
        };
    });
})();
