(function(){
    angular.module('intouch').controller('CreateContactController', function($state, $scope, $http, UserService, HttpHelperService, $compile, AppConfigService){

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


        $scope.save = function(){
            var data = {
                user_id: userId,
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                address: $scope.address,
                birthday: $scope.birth_month+'-'+$scope.birth_day+'-'+$scope.birth_year,
                status_id: $scope.status_id,
                rank_id: $scope.rank_id,
                child_name: $scope.child_name,
                spouse_name: $scope.spouse_name,
                contact_photo: '',
                contact_photo_file: '',
                contact_spouse_photo: '',
                contact_spouse_photo_file: '',
                contact_child_photo: '',
                contact_child_photo_file: '',
                device_id: AppConfigService.getDeviceId()
            };
            
            saveBu = angular.element(document.querySelector('.saveBu'));
            saveBu.html('Loading..').attr('disabled','disabled');

            $.ajax({
                type: "POST",
                url: 'http://www.intouch.pro/api/contact/add_contact/',
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        $state.go('profile.contacts');
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
                    saveBu.html('Save').removeAttr('disabled');

                },
                error: function() {
                    debugger;
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        };



        var child_cnt = 0;
        $scope.addChildElement = function() {
            child_cnt++;
            var children_element = angular.element(document.querySelector('#children'));
            var children_outer = angular.element(document.querySelector('#childrenOuter'));

            html = angular.element(children_element).clone();  
            html1 = angular.element(html);
            html1.attr('id','children'+child_cnt);

            children_outer.append( html1);
            new_children_element = angular.element(document.querySelector('#children'+child_cnt));
            new_children_element_add = angular.element(document.querySelector('#children'+child_cnt+' .add'));
            new_children_element_add.addClass('remove')
                                    .attr('ng-click','removeChildElement('+child_cnt+')')
                                    .removeClass('add');
            new_children_element_txt = angular.element(document.querySelector('#children'+child_cnt+' .input'));
            new_children_element_txt.attr('ng-model','child_name['+child_cnt+']');
                                    
            $compile(new_children_element.contents())($scope);
            $scope.child_name[child_cnt] = '';
        };
        
        $scope.removeChildElement = function(child_cnt) {
            var children_element = angular.element(document.querySelector('#children'+child_cnt));
            children_element.remove();
        };

        $scope.cancel = function() {
            $state.go('profile.contacts');
        };


        


    });


})();
