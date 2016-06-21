(function(){
    angular.module('intouch').controller('EventsController', function($state, $scope){
        var url = 'http://www.intouch.pro/api/contact_events/get_events_by_contact_id/';
        var userId = UserService.getUserId();
        if(userId === 0) {
            alert('Unable to fetch user id');
        }
        var data = {
            user_id: userId
        };

        $scope.activityList = [];
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.activityList = response.data;
                    $scope.$apply();
                }
            },
            error: function() {
                debugger;
            },
            headers : HttpHelperService.getHeaders(),
            dataType: 'json'
        });
    });
})();
