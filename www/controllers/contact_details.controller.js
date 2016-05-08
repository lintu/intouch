(function(){
    angular.module('intouch').controller('ContactDetailsController', function($state, $scope, $stateParams, HttpHelperService, UserService){
        $scope.contactId  = $stateParams.id;

        if(!$scope.contactId) {
            $state.go('profile.contacts');
            return;
        }
        var locallyStoredId = localStorage.getItem('INTOUCH_USER_ID');
        if (locallyStoredId) {
            UserService.setUserId(locallyStoredId);
        } else {
            $state.go('login');
            return;
        }
        var url = 'http://www.intouch.pro/api/contact_events/get_events_by_contact_id/';
        var data = {
            contact_id: $scope.contactId
        }
        $scope.eventList = [];
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.eventList = response.data;
                    $scope.$apply();
                }
            },
            error: function() {
                debugger;
            },
            headers : HttpHelperService.getHeaders(),
            dataType: 'json'
        });

        $scope.editContact = function() {
            $state.go('editContact', {id: $scope.contactId});
        };
        $scope.addEvent = function() {
            alert('event template in a popup');
        };
    });
})();
