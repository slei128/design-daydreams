//daydreams.js is client js file

//opens socket connection
//we pass a "roomid" to the server code so that server can put this socket
//in that room.
var socket = io({query:{room: "abc"}});
var img = document.getElementById('content');

socket.on('displayImage', function(data) {
  displayImage(data.url);
});
socket.on('flashSymbol', function(data) {
  var el = document.getElementById('flash');
  el.innerHTML = data;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 2000);
});

function displayImage(imageURL) {
  img.src = imageURL;
}

img.addEventListener('click', function(event) {
  socket.emit('inputFromDevice', {
    type: "tap"
  });
});
