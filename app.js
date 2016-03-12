var express = require('express');
var app = express();
var messages = {};

app.post('/chatroom/:roomName', function(request, response){
    var roomName = request.params.roomName;
    var username = request.query["username"]
    var message = request.query["message"];
   
    if (!username || username == "") {
      username = "Guest";
    } // Make sure there is a username
    
    var messageValidPush = function(message, room){
        if (message != undefined && message != "") {
            if (messages[room] == undefined){
                messages[room] = []; 
            } 
            messages[room].push(username + ":" + message);  
        }  
    }; // A function to validate message and create messages[room]
    
   if (roomName != undefined && roomName != ""){ 
        messageValidPush(message, roomName);    
   } //First if make sure roomName is defined
    
    var chatRoomJson = {
        "room": {
          "name": roomName,
          "messages": messages[roomName]    
          }
    };
    response.status(200);
    response.send(chatRoomJson);
});

app.listen(56000, function (){
    console.log('Example app listening on port 56000')
})
