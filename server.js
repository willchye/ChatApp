var express = require("express");
var app = express();

var server=require("http").createServer(app);
var io=require("socket.io").listen(server);

//2 arrays
users = [];
connections= [];

server.listen(process.env.PORT || 3000);
console.log("Server running...");

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.sendfile(__dirname + "/index.html");
});

io.sockets.on("connection", function(socket){
	//when a user connects
	connections.push(socket);
	console.log("A user connected; %s users online", connections.length);

	//on disconnect
	socket.on("disconnect", function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log("A user disconnected; %s users online", connections.length)
	});

	socket.on("send message", function(data){
		io.sockets.emit("new message", {msg: data, user: socket.username});
	});

	socket.on("new user", function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	})

	function updateUsernames(){
		io.sockets.emit("get users", users);
	}
});