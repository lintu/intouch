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


        showData();
        var showDataCnt = 0;
        function showData(){
            if(activityList){
                $scope.activityList = activityList;
                if(showDataCnt > 0){
                    $scope.$apply();
                }
                loaderDiv.addClass('ng-hide');
                contentDiv.removeClass('ng-hide');
                if(activityList.length <= 0){
                    notFoundMsg.removeClass('ng-hide');
                }
            }
            else{
                setTimeout(function(){ showDataCnt++; showData(); }, 1000);
            }
        }

        function goToContactDetails(contactId){
            $state.go('contactDetails', {id: contactId});
        }

    });
})();


(function(){
    angular.module('intouch').filter('rawHtml', ['$sce', function($sce){
      return function(val) {
        return $sce.trustAsHtml(val);
      };
    }]);
})();

