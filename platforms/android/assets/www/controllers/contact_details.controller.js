(function(){
    angular.module('intouch').controller('ContactDetailsController', function($state, $scope, $stateParams, HttpHelperService, UserService, AppConfigService){
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
        var userId = UserService.getUserId();

        //-----Contact details---------------------------------------
        var url = 'http://www.intouch.pro/api/contact/get_contacts_by_id/';
        var data = {
            id: $scope.contactId
        }
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
        //--------------------------------------------------------------------

        var loaderDiv = angular.element(document.querySelector('#loaderDiv'));
        var contentDiv = angular.element(document.querySelector('#eventListDiv'));

        //-----Event details---------------------------------------
        getEventDetails();
        function getEventDetails(){
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
                        loaderDiv.addClass('ng-hide');
                        contentDiv.removeClass('ng-hide');
                        $scope.$apply();
                    }
                },
                error: function() {
                    debugger;
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        }
        //--------------------------------------------------------------------

        $scope.editContact = function() {
            $state.go('editContact', {id: $scope.contactId});
        };

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

        //-----Dropdown list of Hours---------------------------------------
        var url = 'http://www.intouch.pro/api/contact_events/get_hour_list/';
        $scope.hourList = [];
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.hourList = objectToArray(response.data);
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

        //-----Dropdown list of Minutes---------------------------------------
        var url = 'http://www.intouch.pro/api/contact_events/get_minute_list/';
        $scope.minuteList = [];
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.minuteList = objectToArray(response.data);
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
        
        var userId = UserService.getUserId();
        var data = {
          user_id: userId
        };

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

        var overlay = angular.element(document.querySelector('#popupOverlay'));
        var addEvent = angular.element(document.querySelector('#addEvent'));
        var eventFormTitle = angular.element(document.querySelector('#eventFormTitle'));
        $scope.addEvent = function() {
            overlay.removeClass('ng-hide');
            addEvent.removeClass('ng-hide');
            eventFormTitle.html('ADD EVENT');
            $scope.editEventId = '';
            $scope.title = '';
            $scope.description = '';
            $scope.reminder_date_day = '';
            $scope.reminder_date_month = '';
            $scope.reminder_date_year = '';
            $scope.reminder_hour = '';
            $scope.reminder_minute = '';
            $scope.am_pm = 'AM';
        };

        $scope.editEvent = function(event_id) {
            overlay.removeClass('ng-hide');
            addEvent.removeClass('ng-hide');
            eventFormTitle.html('EDIT EVENT');

            var url = 'http://www.intouch.pro/api/contact_events/get_events_by_event_id/';
            var data = {
                event_id: event_id
            }
            $scope.editEventList = [];
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(response){
                    if(response.data) {
                        $scope.editEventList = response.data;
                        $scope.editEventId = response.data.id;
                        $scope.title = response.data.title;
                        $scope.description = response.data.description;

                        reminder_date = response.data.reminder_date_time;
                        reminder_arr = reminder_date.split(' ');

                        reminder_date_arr = reminder_arr[0].split('-');
                        $scope.reminder_date_day = reminder_date_arr[1];
                        $scope.reminder_date_month = reminder_date_arr[2];
                        $scope.reminder_date_year = reminder_date_arr[0];
                        
                        reminder_time_arr = reminder_arr[1].split(':');
                        $scope.reminder_hour = reminder_time_arr[0];
                        $scope.reminder_minute = reminder_time_arr[1];
                       
                        $scope.am_pm = response.data.am_pm;
                        $scope.$apply();
                    }
                },
                error: function() {
                    debugger;
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        };

        
        var editStatus = angular.element(document.querySelector('#editStatus'));
        $scope.editStatus = function(status_id) {
            overlay.removeClass('ng-hide');
            editStatus.removeClass('ng-hide');
            $scope.status_id = status_id;
        };

        var editRanking = angular.element(document.querySelector('#editRanking'));
        $scope.editRanking = function(rank_id) {
            overlay.removeClass('ng-hide');
            editRanking.removeClass('ng-hide');
            $scope.rank_id = rank_id;
        };


        $scope.closePopup = function(popup_id){
           closePopup(popup_id);
        };
        function closePopup(popup_id){
            var smlPopup = angular.element(document.querySelector('#'+popup_id));
            overlay.addClass('ng-hide');
            smlPopup.addClass('ng-hide');
        };

        
        //---Save contact event---------------------------------------
        $scope.saveEvent = function(){
            var all_data = {
                user_id: userId,
                contact_id:$scope.contactId,
                title: $scope.title,
                description: $scope.description,
                reminder_date: $scope.reminder_date_month+'-'+$scope.reminder_date_day+'-'+$scope.reminder_date_year,
                reminder_hour: $scope.reminder_hour,
                reminder_minute: $scope.reminder_minute,
                am_pm: $scope.am_pm,
                device_id: AppConfigService.getDeviceId()
            };
            if($scope.editEventId){
                var add_edit_data = {
                    event_id: $scope.editEventId
                };
                url = 'http://www.intouch.pro/api/contact_events/edit_event/';
            }
            else{
                url = 'http://www.intouch.pro/api/contact_events/add_event/';
            }

            var data =  Object.assign(all_data, add_edit_data);
            
            save = angular.element(document.querySelector('#saveEventBtn'));
            save.html('Loading..').attr('disabled','disabled');

            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        getEventDetails();
                        closePopup('addEvent');
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
                    save.html('SAVE').removeAttr('disabled');
                },
                error: function() {
                    debugger;
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        };
        //--------------------------------------------------------------------

       
       //---Save contact status---------------------------------------
        $scope.saveStatus = function(){
            var data = {
                user_id: userId,
                contact_id:$scope.contactId,
                status_id: $scope.status_id,
                device_id: AppConfigService.getDeviceId()
            };
            url = 'http://www.intouch.pro/api/contact_status/update_contact_status/';
           
            save = angular.element(document.querySelector('#saveStatusBtn'));
            save.html('Loading..').attr('disabled','disabled');

            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        statusListSpan = angular.element(document.querySelector('#statusListSpan'));
                        statusListSpan.html($scope.contactStatusList[$scope.status_id]);
                        closePopup('editStatus');
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
                    save.html('SAVE').removeAttr('disabled');
                },
                error: function() {
                    debugger;
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        };
        //--------------------------------------------------------------------

       //---Save contact status---------------------------------------
        $scope.saveRanking = function(){
            var data = {
                user_id: userId,
                contact_id:$scope.contactId,
                rank_id: $scope.rank_id,
                device_id: AppConfigService.getDeviceId()
            };
            url = 'http://www.intouch.pro/api/contact_ranking/update_contact_ranking/';
          
            save = angular.element(document.querySelector('#saveRankingBtn'));
            save.html('Loading..').attr('disabled','disabled');
            
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        rankingListSpan = angular.element(document.querySelector('#rankingListSpan'));
                        rankingListSpan.html($scope.contactRankingList[$scope.rank_id]);
                        closePopup('editRanking');
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
                    save.html('SAVE').removeAttr('disabled');
                },
                error: function() {
                    debugger;
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        };
        //--------------------------------------------------------------------

        $scope.backToContacts = function() {
            $state.go('profile.contacts');
        };

    });
})();
