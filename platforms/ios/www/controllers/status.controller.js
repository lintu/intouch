(function(){
    angular.module('intouch').controller('StatusController', function($state, $scope, $http, UserService, HttpHelperService, AppConfigService){
        
        //----Menu icons actiavating and inactivating------------------------------------------
        var all_menu_element = $('.primeNav .nav a').removeClass('activ');
        var menu_element = angular.element(document.querySelector('.primeNav .nav a.icon_status'));
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
            if(statusList){
                $scope.statusList = statusList;
                if(showDataCnt > 0){
                    $scope.$apply();
                }
                loaderDiv.addClass('ng-hide');
                contentDiv.removeClass('ng-hide');
                if(statusList.length <= 0){
                    notFoundMsg.removeClass('ng-hide');
                }
            }
            else{
                setTimeout(function(){ showDataCnt++; showData(); }, 1000);
            }
        }

        var overlay = angular.element(document.querySelector('#popupOverlay'));
        var addStatus = angular.element(document.querySelector('#addStatus'));
        var statusTitle = angular.element(document.querySelector('#statusTitle'));

        $scope.editStatus = function(status_val,status_id) {
            statusTitle.html('EDIT STATUS');
            overlay.removeClass('ng-hide');
            addStatus.removeClass('ng-hide');
            $scope.status = status_val;
            $scope.editStatusId = status_id;
        };
        $scope.addStatus = function() {
            statusTitle.html('ADD STATUS');
            overlay.removeClass('ng-hide');
            addStatus.removeClass('ng-hide');
            $scope.status = '';
            $scope.editStatusId = '';
        };

        $scope.closePopup = function(popup_id,save_btn){
           closePopup(popup_id,save_btn);
        };

        //---Save contact event---------------------------------------
        $scope.saveStatus = function(){
            var data = {
                user_id: userId,
                status:$scope.status,
                status_id: $scope.editStatusId,
                device_id: AppConfigService.getDeviceId()
            };
            if($scope.editStatusId){
                url = 'http://www.intouch.pro/api/contact_status/edit_user_status/';
            }
            else{
                url = 'http://www.intouch.pro/api/contact_status/add_user_status/';
            }

            //var data =  Object.assign(all_data, add_edit_data);
	        save = angular.element(document.querySelector('.save'));
            save.html('Loading..').attr('disabled','disabled');

            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        getStatusList(userId,HttpHelperService.getHeaders(),false);
                        getContactStatusList(userId,HttpHelperService.getHeaders(),true);
                       // getActivityList(userId,HttpHelperService.getHeaders(),true);
                        $scope.statusList = statusList;
                        closePopup('addStatus','saveStatusBtn');
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
	                save.html('Save').removeAttr('disabled');
                },
                error: function() {
                    alert('Error occured, plz try again.');
                },
                headers : HttpHelperService.getHeaders(),
                dataType: 'json'
            });
        };
        //--------------------------------------------------------------------

	//---Remove Dafault status---------------------------------------
        $scope.removeStatus = function(status_id){
            var data = {
                user_id: userId,
                remove_id:status_id,
                device_id: AppConfigService.getDeviceId()
            };
            url = 'http://www.intouch.pro/api/contact_status/remove_default_status/';

            if(confirm("Do you want to remove the selected status from your list?")){
	            $.ajax({
	                type: "POST",
	                url: url,
	                data: data,
	                success: function(response){
	                    if(response.data && response.data.val_err === false) {
	                        getStatusList(userId,HttpHelperService.getHeaders(),false);
                            getContactStatusList(userId,HttpHelperService.getHeaders(),true);
                           // getActivityList(userId,HttpHelperService.getHeaders(),true);
                            $scope.statusList = statusList;
	                    }
	                    else{
	                        $scope.errorArr  = response.data.val_errs;
	                    }
	                    $scope.$apply();
	                },
	                error: function() {
	                    alert('Error occured, plz try again.');
	                },
	                headers : HttpHelperService.getHeaders(),
	                dataType: 'json'
	            });
            }
        };
        //--------------------------------------------------------------------

    });
})();



