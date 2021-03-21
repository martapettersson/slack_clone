const socket = io();

const loadChannels = () => {
	fetch("/channels/")
		.then((res) => res.json())
		.then((channels) => {
			let channel_list = document.getElementById("channel_list");
			for (channel of channels) {
				let channel_el = `
                <div class="col-12">
					<table class="table table-hover table-dark">
						<tr>
							<td class="link link-light" onclick="loadChannelById('${channel._id}')">
							# ${channel.name}
							</td>
						</tr>
					</table>
                </div>
            `;
				channel_list.innerHTML += channel_el;
			}
		});
};

const createChannel = () => {
	let name = document.getElementById("channel_name");
	let description = document.getElementById("channel_description");
	let channel = {
		name: name.value,
		description: description.value,
	};
	if (name != "") {
		fetch("/channels/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(channel),
		})
			.then((res) => res.json())
			.then((data) => {
				alert(data.message);
				window.location.href = "/dashboard";
			});
	}
};

let channel_id = "";
const channel_messages = document.getElementById("channel_messages");

const loadChannelById = (id) => {
	channel_id = id;
	channel_messages.innerHTML = "";

	fetch(`/channels/${id}`)
		.then((res) => res.json())
		.then((data) => {
			document.getElementById("mainheader").innerHTML = data.channel.name;
			document.getElementById("descriptionheader").innerHTML =
				data.channel.description;
			document.getElementById("room").classList.remove("d-none");

			for (message of data.channel.messages) {
				if (message.user._id == data.user) {
					let editAndDelete = `
						<div class="p-2 justify-self-end">
							<p class="btn btn-secondary" onclick="editMessage()">Edit</p>
							<p class="btn btn-secondary" onclick="deleteMessage('${message._id}')">❌</p>
						</div>`;
					let message_el = `
						<div class="col mb-2">
							<div class="d-flex border border-secondary">
								<div class="p-2">
									<strong>${message.user.name}</strong>, ${new Date(message.date).toUTCString()}
									<p>${message.message}</p>
								</div>
								${editAndDelete}
							</div>
						</div>
					`;
					channel_messages.innerHTML += message_el;
				} else {
					let message_el = `
					<div class="col mb-2">
						<div class="d-flex border border-secondary">
							<div class="p-2">
								<strong>${message.user.name}</strong>, ${new Date(message.date).toUTCString()}
								<p>${message.message}</p>
							</div>
						</div>
					</div>
					`;
					channel_messages.innerHTML += message_el;
				}
			}
		});
};

let user = "";

const createMessage = () => {
	let message = document.getElementById("channel_message");

	if (message.value != "") {
		fetch("/channels/new-message", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message: message.value, channelId: channel_id }),
		})
			.then((res) => res.json())
			.then((newMessage) => {
				user = newMessage.user.userId;
				socket.emit("newChannelMessage", newMessage);
			})
			.catch((error) => console.log(error));
	}

	message.value = "";
};

const deleteMessage = (id) => {
	fetch("/channels/delete-message", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ messageId: id, channelId: channel_id }),
	})
		.then((res) => {})
		.then(() => {
			// let el = document.getElementById(id);
			// el.remove();
			socket.emit("deleteMessage", id);
		})
		.catch((error) => console.log(error));
};

/******************** SOCKET EVENTS ******************/

socket.on("newChannelMessage", (newMessage) => {
	console.log(newMessage);
	let message_el = document.createElement("div");
	message_el.className = "col mb-2";
	if (newMessage.lastMessage.user == user) {
		console.log("it's a match!");
		let editAndDelete = `
			<div class="p-2 justify-self-end">
				<p class="btn btn-secondary" onclick="editMessage()">Edit</p>
				<p class="btn btn-secondary" onclick="deleteMessage('${newMessage.lastMessage._id}')">❌</p>
			</div>`;
		message_el.innerHTML = `
			<div class="col mb-2" id="${newMessage.lastMessage._id}">
				<div class="d-flex border border-secondary">
					<div class="p-2">
						<strong>${newMessage.user.userName}</strong>, ${new Date().toUTCString()}
						<p>${newMessage.lastMessage.message}</p>
					</div>
					${editAndDelete}
				</div>
			</div>	
		`;
		channel_messages.appendChild(message_el);
	} else {
		message_el.innerHTML = `
			<div class="col mb-2" id="${newMessage.lastMessage._id}">
				<div class="d-flex border border-secondary">
					<div class="p-2">
						<strong>${newMessage.user.userName}</strong>, ${new Date().toUTCString()}
						<p>${newMessage.lastMessage.message}</p>
					</div>
				</div>
			</div>	
		`;
		channel_messages.appendChild(message_el);
	}
});

socket.on("deleteMessage", (messageId) => {
	console.log(messageId)
	// channel_messages.removeChild(channel_messages.lastChild)
	let el = document.getElementById(messageId);
	el.parentNode.removeChild(el)
	// el.remove();
});

loadChannels();
