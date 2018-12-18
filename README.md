#pathways image server

## how it works
- everytime a user logs on, it sets/gets the device cookie id and then sends
  the device id to the server by posting to `https://pathways-imgserver.herokuapp.com/deviceRegistration`
- the server receives it and saves it to a global array of all available devices
- whenever the server receives a post request with an image url to 
    `https://pathways-imgserver.herokuapp.com/control`
  the server iterates through the list of devices and sends the image
  to the next device on the list
