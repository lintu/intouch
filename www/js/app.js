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

var body = angular.element(document.querySelector('body'));
function openPopup(popup_id){
    overlay = angular.element(document.querySelector('#popupOverlay'));
    smlPopup = angular.element(document.querySelector('#'+popup_id));
    overlay.removeClass('ng-hide');
    smlPopup.removeClass('ng-hide');
    body.addClass('popupOpen');
}

function closePopup(popup_id,save_btn_id){
    overlay = angular.element(document.querySelector('#popupOverlay'));
    smlPopup = angular.element(document.querySelector('#'+popup_id));
    overlay.addClass('ng-hide');
    smlPopup.addClass('ng-hide');
    body.removeClass('popupOpen');
    if(save_btn_id){
        save = angular.element(document.querySelector('#'+save_btn_id));
        save.html('SAVE').removeAttr('disabled');
    }
}

function openImgUploadPopup(popup_id,profPicDiv){
    uploadImgDispID = profPicDiv;
    overlay = angular.element(document.querySelector('#imgUploadpopupOverlay'));
    smlPopup = angular.element(document.querySelector('#'+popup_id));
    overlay.removeClass('ng-hide');
    smlPopup.removeClass('ng-hide');
    body.addClass('popupOpen');
}

function closeImgUploadPopup(popup_id){
    overlay = angular.element(document.querySelector('#imgUploadpopupOverlay'));
    smlPopup = angular.element(document.querySelector('#'+popup_id));
    overlay.addClass('ng-hide');
    smlPopup.addClass('ng-hide');
    body.removeClass('popupOpen');
}



function previewFile(fileID,imgDivID,imgValID,imgNameID) {
    var imgVal = angular.element(document.querySelector('#'+imgValID));
    var profPic = angular.element(document.querySelector('#'+imgDivID));
    var file    = document.querySelector('#'+fileID).files[0];
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
        profPic.html('<img src="'+reader.result+'">');
        imgVal = reader.result.split('base64,')
        $('#'+imgValID).val(imgVal[1]);
    }, false);
    if (file){
        reader.readAsDataURL(file);
        $('#'+imgNameID).val(file.name);

    }
}




var timeOutSeconds = 15*1000;
var userDetails = "";
function getuserDetails(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/user/get_user_details_by_id/';
    data = {
        id: userID
    };
    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                userDetails = response.data;
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getuserDetails(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}


var activityList = "";
function getActivityList(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/user/get_activities_by_user_id/';
    data = {
        user_id: userID
    };

    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                activityList = response.data;
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getActivityList(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}

var contactList = "";
function getContactList(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/contact/get_contacts_by_user_id/';
    data = {
        user_id: userID
    };

    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                contactList = response.data;
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getContactList(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}

var contactRankingList = [];
function getContactRankingList(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/contact_ranking/get_rank_list_by_user_rankids/';
    data = {
        user_id: userID
    };

    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                contactRankingList = objectToArray(response.data);
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getContactRankingList(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}

var contactStatusList = [];
function getContactStatusList(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/contact_status/get_status_list_by_user_statusids/';
    data = {
        user_id: userID
    };

    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                contactStatusList = objectToArray(response.data);
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getContactStatusList(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}

var dayList = [];
var monthList = [];
var yearList = [];
var curYearList = [];
function getDateList(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/contact/get_date_arr/';
    data = {
        user_id: userID
    };

    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                dayList = objectToArray(response.data.day_arr);
                monthList = objectToArray(response.data.month_arr);
                yearList = objectToArray(response.data.year_arr);
                curYearList = objectToArray(response.data.current_year_arr);
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getDateList(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}

var rankingList = "";
function getRankingList(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/contact_ranking/get_rankings_by_user_rankids/';
    data = {
        user_id: userID
    };

    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                rankingList = response.data;
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getRankingList(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}

var statusList = "";
function getStatusList(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/contact_status/get_status_by_user_statusids/';
    data = {
        user_id: userID
    };

    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                statusList = response.data;
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getStatusList(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}

var followUpList = "";
function getFollowupList(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/contact_events/get_todays_followps_by_user_id/';
    data = {
        user_id: userID
    };

    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                followUpList = response.data;
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getFollowupList(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}

var hourList = [];
function getHourList(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/contact_events/get_hour_list/';
    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                hourList = objectToArray(response.data);
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getHourList(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}

var minuteList = [];
function getMinuteList(userID,HttpHelperService,asyncVal){
    url = 'http://www.intouch.pro/api/contact_events/get_minute_list/';
    $.ajax({
        type: "POST",
        url: url,
        async: asyncVal,
        data: data,
        success: function(response){
            if(response.data) {
                minuteList = objectToArray(response.data);
            }
        },
        timeout: timeOutSeconds,
        error: function() {
            getMinuteList(userID,HttpHelperService,asyncVal);
        },
        headers : HttpHelperService,
        dataType: 'json'
    });
}


