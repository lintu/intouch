(function () {
    var intouch = angular.module('intouch', ['ui.router']);

    intouch.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/splash');
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'html/login.html',
            controller: 'LoginController'
        }).state('splash', {
            url: '/splash',
            templateUrl: 'html/splash.html',
            controller: 'SplashController'
        }).state('profile', {
            url: '/profile',
            templateUrl: 'html/profile.html',
            controller: 'ProfileController'
        }).state('editProfile', {
            url: '/edit-profile',
            templateUrl: 'html/edit_profile.html',
            controller: 'EditProfileController'
        }).state('profile.activities', {
            url: '/activities',
            templateUrl: 'html/activities.html',
            controller: 'ActivitiesController'
        }).state('profile.contacts', {
            url: '/contacts',
            templateUrl: 'html/contacts.html',
            controller: 'ContactsController'
        }).state('profile.events', {
            url: '/events',
            templateUrl: 'html/events.html',
            controller: 'EventsController'
        }).state('signup', {
            url: '/signup',
            templateUrl: 'html/signup.html',
            controller: 'SignUpController'
        }).state('contactDetails', {
            url: '/contact-details/:id',
            templateUrl: 'html/contact_details.html',
            controller: 'ContactDetailsController'
        }).state('createContact', {
            url: '/create-contact',
            templateUrl: 'html/create_contact.html',
            controller: 'CreateContactController'
        }).state('editContact', {
            url: '/edit-contact/:id',
            templateUrl: 'html/edit_contact.html',
            controller: 'EditContactController'
        }).state('profile.status', {
            url: '/status',
            templateUrl: 'html/status.html',
            controller: 'StatusController'
        }).state('profile.follow', {
            url: '/followup',
            templateUrl: 'html/follow.html',
            controller: 'FollowController'
        }).state('profile.ranking', {
            url: '/ranking',
            templateUrl: 'html/ranking.html',
            controller: 'RankingController'
        })

    });
    //document.addEventListener('deviceready', setUp, false);
})();
    //function setUp(){

    //}
function objectToArray (objectArr) {
        var ary = [];
        angular.forEach(objectArr, function (val, key) {
            ary.push({key: key, val: val});
        });
        return ary;
    }



