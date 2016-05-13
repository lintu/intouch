(function(){
    angular.module('intouch').controller('ProfileController', function($state, $scope){
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
