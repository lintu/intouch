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

        
        var locallyStoredId = localStorage.getItem('INTOUCH_USER_ID');
        if (locallyStoredId) {
            UserService.setUserId(locallyStoredId);
        } else {
            $state.go('login');
            return;
        }
        var userId = UserService.getUserId();

        showData();
        var showDataCnt = 0;
        function showData(){
            if(followUpList){
                $scope.followUpList = followUpList;
                if(showDataCnt > 0){
                    $scope.$apply();
                }
                loaderDiv.addClass('ng-hide');
                contentDiv.removeClass('ng-hide');
                if(followUpList.length <= 0){
                    notFoundMsg.removeClass('ng-hide');
                }
            }
            else{
                setTimeout(function(){ showDataCnt++; showData(); }, 1000);
            }
        }



        $scope.goToContactDetails = function(contactId){
            $state.go('contactDetails', {id: contactId});
        };

        
    });
})();
