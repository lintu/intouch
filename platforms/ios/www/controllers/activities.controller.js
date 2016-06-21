(function(){
    angular.module('intouch').controller('ActivitiesController', function($state, $scope, UserService, HttpHelperService){
        
        //----Menu icons actiavating and inactivating------------------------------------------
        var all_menu_element = $('.primeNav .nav a').removeClass('activ');
        var menu_element = angular.element(document.querySelector('.primeNav .nav a.icon_notifi'));
        menu_element.addClass('activ');
        //------------------------------------------------------------------------------------

        var loaderDiv = angular.element(document.querySelector('#loaderDiv'));
        var contentDiv = angular.element(document.querySelector('#contentDiv'));
        var notFoundMsg = angular.element(document.querySelector('.notFoundMsg'));

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
                    loaderDiv.addClass('ng-hide');
                    contentDiv.removeClass('ng-hide');
                    $scope.$apply();
                    if(response.data.length <= 0){
                        notFoundMsg.removeClass('ng-hide');
                    }
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
