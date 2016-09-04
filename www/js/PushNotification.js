
document.addEventListener("deviceready",onDeviceReadyPush,false);
function onDeviceReadyPush(){
alert("Device Ready")
var push = PushNotification.init({ "android": {"senderID": "934104116240"},
"ios": {"alert": "true", "badge": "true", "sound": "true"}, "windows": {} } );

push.on('registration', function(data) {
alert(data.registrationId);
$("#gcm_id").html(data.registrationId);
});

push.on('notification', function(data) {
alert(data.message);
alert(data.title+" Message: " +data.message);
// data.title,
// data.count,
// data.sound,
// data.image,
// data.additionalData
});

push.on('error', function(e) {
alert(e.message);
});
}




