var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
var uploadImgDispID; // id of image tag for show uploaded image


document.addEventListener("deviceready",onDeviceReady,false);
// PhoneGap is ready to be used!
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  alert(imageData);
  var smallImage = document.getElementById(uploadImgDispID);
  imageSrc = "data:image/jpeg;base64," + imageData;
  $('#'+uploadImgDispID+'Div').html('<img src="'+imageSrc+'">');
  $('#'+uploadImgDispID+'Val').val(imageData);
  $('#'+uploadImgDispID+'Name').val(getTimeNumber());

}

// Called when a photo is successfully retrieved
//
function onPhotoFileSuccess(imageUri) {

      var $img = $('<img/>');
      $img.attr('src', imageUri);
      $img.css({position: 'absolute', left: '0px', top: '-999999em', maxWidth: 'none', width: 'auto', height: 'auto'});
      $img.bind('load', function() {
        var canvas = document.createElement("canvas");
        canvas.width = $img.width();
        canvas.height = $img.height();
        var ctx = canvas.getContext('2d');
        ctx.drawImage($img[0], 0, 0);
        var dataUri = canvas.toDataURL('image/png');
        //$mealImg.attr('src', 'data:image/png;base64,' + imageDataUri);
      });



  alert(imageUri);
  alert(dataUri);

  var smallImage = document.getElementById(uploadImgDispID);
  $('#'+uploadImgDispID+'Div').html('<img src="'+imageUri+'">');
  $('#'+uploadImgDispID+'Val').val(getBase64Image(dataUri));
  $('#'+uploadImgDispID+'Name').val(getTimeNumber());

}
// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  alert(imageURI);
  alert(getBase64Image(imageURI));
  var largeImage = document.getElementById(uploadImgDispID);
  $('#'+uploadImgDispID+'Div').html('<img src="'+imageURI+'">');
  $('#'+uploadImgDispID+'Val').val(getBase64Image(imageURI));
  $('#'+uploadImgDispID+'Name').val(getTimeNumber());
}
// A button will call this function
//
function capturePhotoWithData() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
}
function capturePhotoWithFile() {
    navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}
// Called if something bad happens.
// 
function onFail(message) {
  alert('Failed because: ' + message);
}

function getTimeNumber(){
    var d = new Date();
    var n = d.getTime();
    return n;
}

function getBase64Image1(img) {
    try {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");

        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
    catch (e) {
       alert(e);
    }

}

function getBase64Image(url) {
    res = "";
    try {
        var img = new Image();

        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width =this.width;
            canvas.height =this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            res =  dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        };
        img.src = url;
        return res;
    }
    catch (e) {
       alert(e);
    }
}
