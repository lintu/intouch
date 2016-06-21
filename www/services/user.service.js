(function(){
    angular.module('intouch').service('UserService', function(){
        var userId = 0;

        this.setUserId = function(id){
          userId =   id;
        };

        this.getUserId = function() {
            return userId;
        };
    });
})();

