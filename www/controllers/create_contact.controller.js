(function(){
    angular.module('intouch').controller('CreateContactController', function($state, $scope, $stateParams){

        if($stateParams.id) {
            alert('this is an edit for ' + $stateParams.id);
        }
        $scope.save = function() {
            $state.go('profile.contacts');
        };
        $scope.cancel = function() {
            $state.go('profile.contacts');
        };

    });
})();
