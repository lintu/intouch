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

        $scope.contactList = [];
        var url = 'http://www.intouch.pro/api/contact/get_contacts_by_user_id/';
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.contactList = response.data;
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

        //-----Dropdown list of Rnking---------------------------------------
        var url = 'http://www.intouch.pro/api/contact_ranking/get_rank_list_by_user_rankids/';
        $scope.contactRankingList = [];
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.contactRankingList = objectToArray(response.data);
                    $scope.$apply();
                }
            },
            error: function() {
                debugger;
            },
            headers : HttpHelperService.getHeaders(),
            dataType: 'json'
        });
        //--------------------------------------------------------------------

        //-----Dropdown list of Status---------------------------------------
        var url = 'http://www.intouch.pro/api/contact_status/get_status_list_by_user_statusids/';
        $scope.contactStatusList = [];
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.contactStatusList = objectToArray(response.data);
                    $scope.$apply();
                }
            },
            error: function() {
                debugger;
            },
            headers : HttpHelperService.getHeaders(),
            dataType: 'json'
        });
        //--------------------------------------------------------------------
        //-----Dropdown list of date---------------------------------------
        var url = 'http://www.intouch.pro/api/contact/get_date_arr/';
        $scope.dayList = [];
        $scope.monthList = [];
        $scope.yearList = [];
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.dayList = objectToArray(response.data.day_arr);
                    $scope.monthList = objectToArray(response.data.month_arr);
                    $scope.yearList = objectToArray(response.data.year_arr);
                    $scope.$apply();
                }
            },
            error: function() {
                debugger;
            },
            headers : HttpHelperService.getHeaders(),
            dataType: 'json'
        });
        //--------------------------------------------------------------------

        var overlay = angular.element(document.querySelector('#popupOverlay'));
        var searchContact = angular.element(document.querySelector('#searchContact'));
        $scope.searchFormShow = function() {
            overlay.removeClass('ng-hide');
            searchContact.removeClass('ng-hide');
        };

        var filterContact = angular.element(document.querySelector('#filterContact'));
        $scope.filterFormShow = function() {
            overlay.removeClass('ng-hide');
            filterContact.removeClass('ng-hide');
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
                    debugger;
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        };

        $scope.closePopup = function(popup_id){
           closePopup(popup_id);
        };
        function closePopup(popup_id){
            var smlPopup = angular.element(document.querySelector('#'+popup_id));
            overlay.addClass('ng-hide');
            smlPopup.addClass('ng-hide');
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
