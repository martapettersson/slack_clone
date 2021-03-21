const messageForm = document.getElementById("message_form");
const channelMessages = document.getElementById("channel_messages");
const onlineList = document.getElementById("online_list");
const roomId = document.getElementById("room_id").value;
const userId = document.getElementById("user_id").value;
const userName = document.getElementById("user_name").value;

const socket = io();

// Join chatroom
socket.emit("joinRoom", { userName, roomId });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
	outputUsers(users);
});

// Message from server
socket.on("message", (msg) => {
	outputMessage(msg);

	// Scroll down
	channelMessages.scrollTop = channelMessages.scrollHeight;
});

//Message submit
messageForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const msg = e.target.elements.msg.value;

    if(msg) {
        // Save to DB
	fetch("/channels/message/create", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({msg, roomId}),
	})
		.then((res) => res.json())
		.then((data) => {
			//Emit msg to server
			socket.emit("channelMessage", msg);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
    }
    e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

// Output message to DOM

const outputMessage = (msg) => {
	const div = document.createElement("div");
	div.className = "bg-white text-dark mb-1";
    const editAndDelete = `
        <hr>
        <button type="button" class="btn btn-secondary">❌</button>
    `
	div.innerHTML = `
    <hr>
        <button type="button" class="btn btn-secondary">❌</button>
    <strong>${msg.username} <span>${msg.time}</span></strong>
        <p class="text">
            ${msg.text}
        </p>`;
	channelMessages.appendChild(div);
};

// Add users to DOM
const outputUsers = (users) => {
	onlineList.innerHTML = `
        ${users.map((user) => `<p>💚 ${user.username}</p>`).join("")}
    `;
};
