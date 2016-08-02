(function(){
    angular.module('intouch').controller('ProfileController', function($state, $scope, $http, UserService, HttpHelperService){

        var locallyStoredId = localStorage.getItem('INTOUCH_USER_ID');
        if (locallyStoredId) {
            UserService.setUserId(locallyStoredId);
        } else {
            $state.go('login');
            return;
        }
        var userId = UserService.getUserId();

        $scope.userDetails = userDetails;

        $scope.editProfile = function(){
            $state.go('editProfile');
        }
        $scope.logout = function() {
            sessionStorage.removeItem('INTOUCH_ACCESS_TOKEN');
            userDetails = "";
            activityList = "";
            contactList = "";
            contactRankingList = [];
            contactStatusList = [];
            dayList = [];
            monthList = [];
            yearList = [];
            rankingList = "";
            statusList = "";
            followUpList = "";
            hourList = [];
            minuteList = [];
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
