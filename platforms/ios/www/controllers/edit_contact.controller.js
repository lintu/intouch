(function(){
    angular.module('intouch').controller('EditContactController', function($state, $scope, $stateParams, $http, UserService, HttpHelperService, $compile, AppConfigService){
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

        var child_cnt = 0;
        var url = 'http://www.intouch.pro/api/contact/get_contacts_by_id/';
        var data = {
            id: $scope.contactId
        }
        $scope.contact_arr = [];
        $scope.child_name = [];
        child_arr = [];
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(response){
                if(response.data) {
                    $scope.contactList = response.data;
                    $scope.name = response.data.name;
                    $scope.email = response.data.email;
                    $scope.phone = response.data.phone;
                    $scope.address = response.data.address;
                    //$scope.birthday = response.data.birthday;

                    birthday = response.data.birthday;
                    birth_date_arr = birthday.split('-');
                    $scope.birth_month = birth_date_arr[1];
                    $scope.birth_day = birth_date_arr[2];
                    $scope.birth_year = birth_date_arr[0];

                    $scope.status_id = response.data.status_id;
                    $scope.rank_id = response.data.rank_id;
                    $scope.child_name[0] = '';
                    if(response.data.contacts_children.length > 0){
                        $scope.child_name[0] = response.data.contacts_children[0].name;
                    }
                    $scope.spouse_name = '';
                    if(response.data.contacts_spouses.length > 0){
                        $scope.spouse_name = response.data.contacts_spouses[0].name;
                    }
                    $scope.$apply();
                    child_arr = response.data.contacts_children;
                    for(var i in child_arr){
                        if(i > 0){
                            add_child_element(child_arr[i].name,child_arr[i].photo);
                        }
                    }
                }
            },
            error: function(xhr, status, error) {
                  var err = xhr.responseText;
                  alert(err.Message);
            },
            headers : HttpHelperService.getHeaders(),
            dataType: 'json'
        });

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

        $scope.save = function(){
            var birthday_val = '';
            if($scope.birth_month || $scope.birth_day || $scope.birth_year){
                birthday_val = $scope.birth_month+'-'+$scope.birth_day+'-'+$scope.birth_year;
            }
            var data = {
                user_id: userId,
                contact_id: $scope.contactId,
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
                //contact_spouse_photo_file: '',
                contact_child_photo: '',
               // contact_child_photo_file: '',
                device_id: AppConfigService.getDeviceId()
            };
            
            saveBu = angular.element(document.querySelector('.saveBu'));
            saveBu.html('Loading..').attr('disabled','disabled');

            $.ajax({
                type: "POST",
                url: 'http://www.intouch.pro/api/contact/update_contact/',
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        getContactList(userId,HttpHelperService.getHeaders(),false);
                        getActivityList(userId,HttpHelperService.getHeaders(),true);
                        $state.go('contactDetails', {id: $scope.contactId});
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
                    saveBu.html('Save Changes').removeAttr('disabled');
                },
                error: function() {
                    alert('Error occured, plz try again.');
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        };



        $scope.addChildElement = function() {
            add_child_element();
        };

        $scope.removeChildElement = function(child_cnt) {
            var children_element = angular.element(document.querySelector('#children'+child_cnt));
            children_element.remove();
        };

        $scope.cancel = function(){
            $state.go('contactDetails', {id: $scope.contactId});
        };

        function add_child_element(child_name, child_img){
            if(child_img){
                child_img = '<img src="http://www.intouch.pro/uploads/thumb/'+child_img+'">';
            }
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
           
            new_children_element_img=angular.element(document.querySelector('#children'+child_cnt+' .picture'));
            new_children_element_img.html(child_img);

            $compile(new_children_element.contents())($scope);
            $scope.child_name[child_cnt] = child_name;

        }
    });
})();
