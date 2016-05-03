(function(){
    angular.module('intouch').controller('ContactDetailsController', function($state, $scope, $stateParams){
        $scope.contactId  = $stateParams.id;


        $scope.editContact = function() {
            $state.go('editContact', {id: $scope.contactId});
        };
        $scope.addEvent = function() {
            alert('event template in a popup');
        };
    });
})();
