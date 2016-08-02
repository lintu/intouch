(function(){
    angular.module('intouch').controller('RankingController', function($state, $scope, $http, UserService, HttpHelperService, AppConfigService){
        
        //----Menu icons actiavating and inactivating------------------------------------------
        var all_menu_element = $('.primeNav .nav a').removeClass('activ');
        var menu_element = angular.element(document.querySelector('.primeNav .nav a.icon_rank'));
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
            if(rankingList){
                $scope.rankingList = rankingList;
                if(showDataCnt > 0){
                    $scope.$apply();
                }
                loaderDiv.addClass('ng-hide');
                contentDiv.removeClass('ng-hide');
                if(rankingList.length <= 0){
                    notFoundMsg.removeClass('ng-hide');
                }
            }
            else{
                setTimeout(function(){ showDataCnt++; showData(); }, 1000);
            }
        }


        var overlay = angular.element(document.querySelector('#popupOverlay'));
        var addRanking = angular.element(document.querySelector('#addRanking'));
        var rankingTitle = angular.element(document.querySelector('#rankingTitle'));

        $scope.editRanking = function(ranking_val,ranking_id) {
            rankingTitle.html('EDIT RANKING');
            overlay.removeClass('ng-hide');
            addRanking.removeClass('ng-hide');
            $scope.rank = ranking_val;
            $scope.editRankingId = ranking_id;
        };
        $scope.addRanking = function() {
            rankingTitle.html('ADD RANKING');
            overlay.removeClass('ng-hide');
            addRanking.removeClass('ng-hide');
            $scope.rank = '';
            $scope.editRankingId = '';
        };

        $scope.closePopup = function(popup_id,save_btn){
           closePopup(popup_id,save_btn);
        };

        //---Save contact event---------------------------------------
        $scope.saveRanking = function(){
            var data = {
                user_id: userId,
                rank:$scope.rank,
                rank_id: $scope.editRankingId,
                device_id: AppConfigService.getDeviceId()
            };
            if($scope.editRankingId){
                url = 'http://www.intouch.pro/api/contact_ranking/edit_user_rankings/';
            }
            else{
                url = 'http://www.intouch.pro/api/contact_ranking/add_user_rankings/';
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
                        getRankingList(userId,HttpHelperService.getHeaders(),false);
                        getContactRankingList(userId,HttpHelperService.getHeaders(),true);
                        getActivityList(userId,HttpHelperService.getHeaders(),true);
                        $scope.rankingList = rankingList;
                        closePopup('addRanking','saveRankingBtn');
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

	//---Remove Dafault ranking---------------------------------------
        $scope.removeRanking = function(ranking_id){
            var data = {
                user_id: userId,
                remove_id:ranking_id,
                device_id: AppConfigService.getDeviceId()
            };
            url = 'http://www.intouch.pro/api/contact_ranking/remove_default_ranking/';

            if(confirm("Do you want to remove the selected ranking from your list?")){
	            $.ajax({
	                type: "POST",
	                url: url,
	                data: data,
	                success: function(response){
	                    if(response.data && response.data.val_err === false) {
	                        getRankingList(userId,HttpHelperService.getHeaders(),false);
                            getContactRankingList(userId,HttpHelperService.getHeaders(),true);
                            getActivityList(userId,HttpHelperService.getHeaders(),true);
                            $scope.rankingList = rankingList;
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
