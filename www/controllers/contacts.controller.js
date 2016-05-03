(function(){
    angular.module('intouch').controller('ContactsController', function($state, $scope){
        $scope.goToContact = function(contactId){
            $state.go('contactDetails', {id: contactId});
        }
        $scope.goToCreateContact = function() {
            $state.go('createContact');
        };
        $scope.setFilter = function() {
            alert('show edit filter modal')
        }
    });
})();
