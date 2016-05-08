(function(){
    angular.module('intouch').controller('ContactsController', function($state, $scope, $http, UserService, HttpHelperService){
        var url = 'http://www.intouch.pro/api/contact/get_contacts_by_user_id/';
        var locallyStoredId = localStorage.getItem('INTOUCH_USER_ID');
        if (locallyStoredId) {
            UserService.setUserId(locallyStoredId);
        } else {
            $state.go('login');
            return;
        }
        var userId = UserService.getUserId();
        var data = {
          user_id: userId
        };

        $scope.contactList = [];
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.contactList = response.data;
                    $scope.$apply();
                }
            },
            error: function() {
                debugger;
            },
            headers : HttpHelperService.getHeaders(),
            dataType: 'json'
        });
        $scope.goToContactDetails = function(contactId){
            $state.go('contactDetails', {id: contactId});
        };
        $scope.goToCreateContact = function() {
            $state.go('createContact');
        };
        $scope.setFilter = function() {
            alert('show edit filter modal')
        }
    });
})();
