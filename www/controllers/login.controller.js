(function(){
    angular.module('intouch').controller('LoginController', function($state, $scope){
        $scope.username = '';
        $scope.password = '';
        $scope.login = function(){
            $state.go('profile.activities');
        };
        $scope.signup = function(){
            $state.go('signup');
        };
    });
})();
