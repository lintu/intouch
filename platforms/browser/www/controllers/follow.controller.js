(function(){
    angular.module('intouch').controller('FollowController', function($state, $scope, $http, UserService, HttpHelperService){

        //----Menu icons actiavating and inactivating------------------------------------------
        var all_menu_element = $('.primeNav .nav a').removeClass('activ');
        var menu_element =angular.element(document.querySelector('.primeNav .nav a.icon_calendar'));
        menu_element.addClass('activ');
        //------------------------------------------------------------------------------------
        var loaderDiv = angular.element(document.querySelector('#loaderDiv'));
        var contentDiv = angular.element(document.querySelector('.contactList'));
        var notFoundMsg = angular.element(document.querySelector('.notFoundMsg'));

        
        var url = 'http://www.intouch.pro/api/contact_events/get_todays_followps_by_user_id/';
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

        $scope.followUpList = [];
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.followUpList = response.data;
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

        $scope.goToContactDetails = function(contactId){
            $state.go('contactDetails', {id: contactId});
        };

        
    });
})();
