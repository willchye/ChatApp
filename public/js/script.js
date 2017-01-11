$(function(){
	var socket = io.connect();
	var users = $("#users");
	var userFormArea = $("#userFormArea");
	var userForm = $("#userForm");
	var username = $("#username");


	var messageArea = $("#messageArea")
	var messageForm = $("#messageForm");
	var message = $("#message");
	var chat = $("#chat");

	messageForm.submit(function(e){
		if (message.val() != ""){
			e.preventDefault();
			console.log("Submitted!");
			socket.emit("send message", message.val());
			message.val("");
		}
		else return false;
	});
	message.keypress(function(e){
        if(e.which == 13){//Enter key pressed
            messageForm.submit();//Trigger search button click event
        }
    });

	socket.on("new message", function(data){
		chat.append("<div class='well'><strong>"+data.user+": </strong>"+data.msg+"</div>")
	})

	userForm.submit(function(e){
		e.preventDefault();
		socket.emit("new user", username.val(), function(data){
			if (data){
				userFormArea.hide();
				messageArea.show();
			}
		});
		username.val("");
	});
	username.keypress(function(e){
        if(e.which == 13){//Enter key pressed
            userForm.submit();//Trigger search button click event
        }
    });

	socket.on("get users", function(data){
		var html = "";
		for (i=0; i<data.length; i++){
			html += "<li class='list-group-item'>"+data[i]+"</li>";
		}
		users.html(html);
	})
});