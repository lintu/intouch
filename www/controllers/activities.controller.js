(function(){
    angular.module('intouch').controller('ActivitiesController', function($state, $scope, UserService, HttpHelperService){
        var url = 'http://www.intouch.pro/api/user/get_activities_by_user_id/';
        var locallyStoredId = localStorage.getItem('INTOUCH_USER_ID');
        if (locallyStoredId) {
            UserService.setUserId(locallyStoredId);
        }
        var userId = UserService.getUserId();

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
