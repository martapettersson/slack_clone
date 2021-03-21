const online_list = document.getElementById("online_list");

fetch("/online")
	.then((res) => res.json())
	.then((userName) => {
		console.log(userName)
		socket.emit("joinServer", userName);
	});

socket.on("usersOnline", (users) => {
    console.log(users)
	online_list.innerHTML = "";
	for (user of users) {
		let user_el = document.createElement("div");
		user_el.textContent = "🟢 " + user.userName;
		online_list.appendChild(user_el);
	}
});