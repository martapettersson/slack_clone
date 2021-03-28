const messageForm = document.getElementById("message_form");
const channelMessages = document.getElementById("channel_messages");
const onlineList = document.getElementById("online_list");
const roomId = document.getElementById("room_id").value;
const userId = document.getElementById("user_id").value;
const userName = document.getElementById("user_name").value;

channelMessages.scrollTop = channelMessages.scrollHeight;


/************************* SOCKET *************************/

const socket = io();

// Join chatroom
socket.emit("joinRoom", { userName, roomId, userId });

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

socket.on("delete", (messageId) => {
	let el = document.getElementById(messageId);
	el.parentNode.removeChild(el)
});

/************************* Message submit *************************/

messageForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const msg = e.target.elements.msg.value;

	if (msg) {
		// Save to DB
		fetch("/channels/message/create", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ msg, roomId }),
		})
			.then((res) => res.json())
			.then((data) => {
				let messageId = data.messages[data.messages.length -1]._id
				//Emit msg to server
				socket.emit("channelMessage", {msg, messageId});
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

/*********************** Output message to DOM *********************/

const outputMessage = (content) => {
	const div = document.createElement("div");
	div.setAttribute("id", `${content.messageId}`);
	div.className = "message";

	const editAndDelete = `
        <button onclick="deleteMessage('${content.messageId}')" type="button" class="delete-btn btn-secondary">❌</button>
    `;

	if(content.userId == userId) {
		div.innerHTML = `
    	<strong class="meta">${content.msg.username}</strong> <span>${content.msg.time}</span> <span>${editAndDelete}</span>
        <p class="text">
            ${content.msg.text} 
        </p>
		`
		;
	} else {
		div.innerHTML = `
    	<strong class="meta">${content.msg.username}</strong> <span>${content.msg.time}</span>
        <p class="text">
            ${content.msg.text}
        </p>`;
	}
	channelMessages.appendChild(div);
};

/*********************** Add users to DOM *********************/

const outputUsers = (users) => {
	onlineList.innerHTML = `
        ${users.map((user) => `<p>🟢 ${user.username}</p>`).join("")}
    `;
};

/*********************** DELETE MESSAGE *********************/

const deleteMessage = (id) => {
	fetch("/channels/message/delete", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ messageId: id, channelId: roomId }),
	})
		.then((res) => {})
		.then(() => {
			socket.emit("deleteMessage", id);
		})
		.catch((error) => console.log(error));
};