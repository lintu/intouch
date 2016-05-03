(function(){
    angular.module('intouch').controller('SplashController', function($state, $timeout){
        //prefetch requrired things here
        $timeout(function(){
            $state.go('login');
        }, 2000);
    });
})();
