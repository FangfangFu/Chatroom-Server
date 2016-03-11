var express = require('express');
var app = express();
var messages = [];
app.post('/chatroom/:username', function(request, response){
    var username = request.params.username;
    var message = request.query["message"];
    messages.push(username + ":" + message);
    response.status(200);
    response.send(messages);
});

app.get('/chatroom', function (request, response){
    response.send(messages);
})

app.listen(56000, function (){
    console.log('Example app listening on port 56000')
})