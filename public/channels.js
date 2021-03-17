const loadChannels = () => {
	fetch("/channels/read")
		.then((res) => res.json())
		.then((channels) => {
			let channel_list = document.getElementById("channel_list");
			for (channel of channels) {
				let channel_el = `
                <div class="col-12">
                    <p class="link link-light" onclick="loadChannelById('${channel._id}')"># ${channel.name}</p>
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
		.then((channel) => {
			document.getElementById("mainheader").innerHTML = channel.name;
			document.getElementById("descriptionheader").innerHTML =
				channel.description;
			document.getElementById("room").classList.remove("d-none");

			for (message of channel.messages) {
				let message_el = `
			    <div class="col mb-2">
			        <div class="p-2 border border-secondary">
			            <strong>${message.user.name}</strong>, ${new Date(message.date).toUTCString()}
			            <p>${message.message}</p>
			        </div>
			    </div>
			`;
				channel_messages.innerHTML += message_el;
			}
		});
};

const socket = io();

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
			.then((data) => {
				socket.emit("newChannelMessage", data);
			})
			.catch((error) => console.log(error));
	}

	message.value = "";
};

socket.on("newChannelMessage", (message) => {
	let message_el = document.createElement("div");
	message_el.className = "col mb-2";

	message_el.innerHTML = `
        <div class="p-2 border border-secondary"">
            <strong>${message.user}</strong>, ${new Date().toUTCString()}
            <p>${message.message}</p>
        </div>`;
	channel_messages.appendChild(message_el);
});

loadChannels();
