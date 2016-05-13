(function(){
    angular.module('intouch').controller('EditProfileController', function($state, $scope){
        $scope.goToProfile = function() {
            $state.go('profile');
        }
    });
})();
