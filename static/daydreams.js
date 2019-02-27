//daydreams.js is client js file

//opens socket connection
//we pass a "roomid" to the server code so that server can put this socket
//in that room.
var socket = io({query:{room: "abc"}});

socket.on('displayImage', function(data) {
  displayImage(data.url);
});

function displayImage(imageURL) {
  var img = document.getElementById('content');
  img.src = imageURL;
}

function deviceIdGenerator() {
	return Math.random().toString(36).substr(2,16);
};

function setCookie(key, value) {
	document.cookie = encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value)) + ";path=/";
}

function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

window.deviceId = getCookie("id");

if(!window.deviceId){
	const idVal = deviceIdGenerator();
	setCookie("id", idVal);
	window.deviceId = idVal;
}

console.log('device id', deviceId);
