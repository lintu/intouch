(function(){
    angular.module('intouch').controller('ContactsController', function($state, $scope, $http, UserService, HttpHelperService, AppConfigService ){
        
        //----Menu icons actiavating and inactivating------------------------------------------
        var all_menu_element = $('.primeNav .nav a').removeClass('activ');
        var menu_element = angular.element(document.querySelector('.primeNav .nav a.icon_user'));
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
        var data = {
          user_id: userId
        };

        showData();
        var showDataCnt = 0;
        function showData(){
            if(contactList){
                $scope.contactList = contactList;
                if(showDataCnt > 0){
                    $scope.$apply();
                }
                loaderDiv.addClass('ng-hide');
                contentDiv.removeClass('ng-hide');
                if(contactList.length <= 0){
                    notFoundMsg.removeClass('ng-hide');
                }
            }
            else{
                setTimeout(function(){ showDataCnt++; showData(); }, 1000);
            }
        }

        //-----Dropdown list of Rnking---------------------------------------
        $scope.contactRankingList = contactRankingList;
        //--------------------------------------------------------------------

        //-----Dropdown list of Status---------------------------------------
        $scope.contactStatusList = contactStatusList;
        //--------------------------------------------------------------------
        //-----Dropdown list of date---------------------------------------
        $scope.dayList = dayList;
        $scope.monthList = monthList;
        $scope.yearList = yearList;
        //--------------------------------------------------------------------

        $scope.searchFormShow = function() {
            openPopup('searchContact');
        };

        $scope.filterFormShow = function() {
            openPopup('filterContact');
        };

        $scope.searchContact = function(popupID,actionType){
            search_followup_date_from_val  = "";
            search_followup_date_to_val  = "";
            search_status_val  = "";
            search_rank_val  = "";
            keyword_search_val  = "";
            if($scope.followup_date_from_day && $scope.followup_date_from_month && $scope.followup_date_from_year){
               search_followup_date_from_val =  $scope.followup_date_from_month+'-'+$scope.followup_date_from_day+'-'+$scope.followup_date_from_year;
            }
            if($scope.followup_date_to_day && $scope.followup_date_to_month && $scope.followup_date_to_year){
               search_followup_date_to_val =  $scope.followup_date_to_month+'-'+$scope.followup_date_to_day+'-'+$scope.followup_date_to_year;
            }
            if($scope.search_status){
               search_status_val =  $scope.search_status;
            }
            if($scope.search_rank){
               search_rank_val =  $scope.search_rank;
            }
            if($scope.keyword_search){
               keyword_search_val =  $scope.keyword_search;
            }
            var data = {
                user_id: userId,
                keyword_search: keyword_search_val,
                search_status: search_status_val,
                search_rank: search_rank_val,
                search_followup_date_from: search_followup_date_from_val,
                search_followup_date_to: search_followup_date_to_val,
                sort_field: '',
                sort_order: '',
                device_id: AppConfigService.getDeviceId()
            };
            
            saveBu = angular.element(document.querySelector('.'+popupID+'Btn'));
            saveBu.html('Loading..').attr('disabled','disabled');

            $.ajax({
                type: "POST",
                url: 'http://www.intouch.pro/api/contact/serach_contacts/',
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        $scope.contactList = response.data.contact_arr;
                        if(response.data.contact_arr.length <= 0){
                            notFoundMsg.removeClass('ng-hide');
                        }
                        else{
                            $scope.errorArr  = response.data.val_errs;
                        }
                    }
                    $scope.$apply();
                    saveBu.html(actionType).removeAttr('disabled');
                    closePopup(popupID);

                },
                error: function() {
                    alert('Error occured, plz try again.');
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        };

        $scope.closePopup = function(popup_id){
           closePopup(popup_id);
        };

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
