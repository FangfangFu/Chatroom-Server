var express = require('express');
var app = express();
var messages = {};
var maxMessagePerRoom = 1000;
var defaultMemberExpiration = 5*60;
var members = {};
 
app.post('/api/v1/chatroom/:roomName', function(request, response){
    var roomName = request.params.roomName;
    var username = request.query["username"]
    var message = request.query["message"];
    var expireAfter = request.query["expireafter"];
   
   // Make sure there is a username
    
    if (!expireAfter) {
      expireAfter = defaultMemberExpiration;
    }
    if (!username || username == "") {
      username = "Guest";
    } 
    
    
   // A function to validate message and create messages[room]
    var messageValidPush = function(message, room){
        if (message != undefined && message != "") {
            if (messages[room] == undefined){
                messages[room] = []; 
            } 
            messages[room].push(username + ": " + message);  
        }  
    }; 
    
    //First if make sure roomName is defined
    if (roomName != undefined && roomName != ""){ 
        messageValidPush(message, roomName);    
    }
     
    if (members[roomName] == undefined){
        members[roomName] = [];
    } 
    var membersString = updateMembers(members[roomName], username, expireAfter);
    if (membersString == undefined) {membersString = "";}

    var chatRoomJson = {
        "room": {
          "name": roomName,
          "members": membersString,
          "messages": messages[roomName]    
          }
    };
    response.status(200);
    response.send(chatRoomJson);
});

app.listen(56000, function (){
    console.log('Example app listening on port 56000')
})

function updateMembers(array, username, expireAfter){
    var currentTimeStamp = Date.now() + expireAfter * 1000; 
    var member = username + ":" + currentTimeStamp;
    noRepeatUsername(array, username);
    if(expireAfter != 0){
            array.push(member);
    }
    
    checkExpireMember(array);
    var string = convertArraytoString(array);
    return string;
}

function noRepeatUsername(array, username){
    for (var i = 0; i < array.length; i++){
        var arrayMember = array[i].split(":")[0];
        var arrayTime = array[i].split(":")[1];
        if(arrayMember == username) {
            array.splice(i, 1);
        } 
    }
}
function checkExpireMember(array){
    for (var i = 0; i < array.length; i++){
        var arrayMember = array[i].split(":")[0];
        var arrayTime = array[i].split(":")[1];
        if (arrayTime < Date.now()) {
            array.splice(i, 1);
        } 
    }
}
function convertArraytoString(array){
    var resultString = "";
    if (array != undefined && array != []){
        resultString = array[0];
        for (i = 1; i < array.length; i++){
            resultString += "," + array[i];
        }       
    }
    return resultString;
}


