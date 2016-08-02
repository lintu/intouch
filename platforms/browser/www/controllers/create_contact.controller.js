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
        $scope.name = '';
        $scope.email = '';
        $scope.phone = '';
        $scope.address = '';
        $scope.status_id = '';
        $scope.rank_id = '';
        $scope.child_name = [];
        $scope.child_name[0] = '';
        $scope.spouse_name = '';
        $scope.birth_month = '';
        $scope.birth_day = '';
        $scope.birth_year = '';

        $scope.save = function(){
            var birthday_val = '';
            if($scope.birth_month || $scope.birth_day || $scope.birth_year){
                birthday_val = $scope.birth_month+'-'+$scope.birth_day+'-'+$scope.birth_year;
            }
            var data = {
                user_id: userId,
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                address: $scope.address,
                birthday: birthday_val,
                status_id: $scope.status_id,
                rank_id: $scope.rank_id,
                child_name: $scope.child_name,
                spouse_name: $scope.spouse_name,
                contact_photo: '',
                contact_photo_file: '',
                contact_spouse_photo: '',
               // contact_spouse_photo_file: '',
                contact_child_photo: '',
               // contact_child_photo_file: '',
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
                        getContactList(userId,HttpHelperService.getHeaders(),false);
                        getActivityList(userId,HttpHelperService.getHeaders(),true);
                        $state.go('profile.contacts');
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
                    saveBu.html('Save').removeAttr('disabled');

                },
                error: function() {
                    alert('Error occured, plz try again.');
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
