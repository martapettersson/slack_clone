const online_list = document.getElementById("online_list");
let users = [];

fetch("/online")
	.then((res) => res.json())
	.then((user) => {
		socket.emit("userOnline", user);
	});

socket.on("userOnline", (user) => {
    console.log(user)
    // users.push(user)
    // console.log(users)
	// for (user of users) {
		let user_el = document.createElement("div");
		user_el.textContent = user;
		online_list.appendChild(user_el);
	// }
});
