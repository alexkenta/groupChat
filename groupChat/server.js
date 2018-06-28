const express = require("express");
const bodyParser = require("body-parser");
const path = require("path")
// const session = require("express-session")
const port = process.env.PORT || 8000;
const app = express();
const all_messages = [] //list to push all messages into

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({secret: 'supersecret'}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "./views"));

app.get('/', function(request, response){
    response.render('index')
})

const server = app.listen(port, function(){
    console.log(`Listening on port ${port}`)
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    console.log('Client/socket is connected!');
    console.log('Client/socket id is: ' + socket.id)

 //listen for new message, broadcast the message and user to everyone, push into all_messages list
    socket.on("new_message", function(data){
        io.emit("post_new_message", {name: data.name, message: data.message})
        all_messages.push({name: data.name, message: data.message})
        console.log(data.name, data.message)
    })
//listen for user logging in, take data(name) and EMIT all previous messages back to user.
    socket.on("load_page", function(data){
        socket.emit("get_all_messages", {name: data.name, messages: all_messages})
    })
})