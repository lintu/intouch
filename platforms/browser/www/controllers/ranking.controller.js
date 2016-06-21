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
       

        getRankingDetails();

        function getRankingDetails(){
		    var url = 'http://www.intouch.pro/api/contact_ranking/get_rankings_by_user_rankids/';
		    var data = {
	          user_id: userId
	        };
		    $scope.rankingList = [];
		    $.ajax({
		        type: "POST",
		        url: url,
		        data: data,
		        success: function(response){
		            if(response.data) {
		                $scope.rankingList = response.data;
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

        $scope.closePopup = function(popup_id){
           closePopup(popup_id);
        };
        function closePopup(popup_id){
            var smlPopup = angular.element(document.querySelector('#'+popup_id));
            overlay.addClass('ng-hide');
            smlPopup.addClass('ng-hide');
	        save = angular.element(document.querySelector('.save'));
            save.html('Save').removeAttr('disabled');
        };

        //---Save contact event---------------------------------------
        $scope.saveRanking = function(){
            var all_data = {
                user_id: userId,
                rank:$scope.rank,
                device_id: AppConfigService.getDeviceId()
            };
            if($scope.editRankingId){
                var add_edit_data = {
                    rank_id: $scope.editRankingId
                };
                url = 'http://www.intouch.pro/api/contact_ranking/edit_user_rankings/';
            }
            else{
                url = 'http://www.intouch.pro/api/contact_ranking/add_user_rankings/';
            }

            var data =  Object.assign(all_data, add_edit_data);
	        save = angular.element(document.querySelector('.save'));
            save.html('Loading..').attr('disabled','disabled');

            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(response){
                    if(response.data && response.data.val_err === false) {
                        getRankingDetails();
                        closePopup('addRanking');
                    }
                    else{
                        $scope.errorArr  = response.data.val_errs;
                    }
                    $scope.$apply();
	                save.html('Save').removeAttr('disabled');
                },
                error: function() {
                    debugger;
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
	                        getRankingDetails();
	                    }
	                    else{
	                        $scope.errorArr  = response.data.val_errs;
	                    }
	                    $scope.$apply();
	                },
	                error: function() {
	                    debugger;
	                },
	                headers : HttpHelperService.getHeaders(),
	                dataType: 'json'
	            });
            }
        };
        //--------------------------------------------------------------------

    });
})();
