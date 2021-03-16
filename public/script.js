const loadChannels = () => {
	fetch("/channels")
		.then((res) => res.json())
		.then((channels) => {
			// for every channel in db new element in channel_list
			let channel_list = document.getElementById("channel_list");
			for (channel of channels) {
				let channel_el = `
                <div class="col-12">
                    <p class="link link-light" onclick="loadChannel('${channel._id}')"># ${channel.name}</p>
                </div>
            `;
				channel_list.innerHTML += channel_el;
			}
		});
};

const createChannel = () => {
	const channel = {
		name: document.getElementById("new_channel_input").value,
	};
	if (channel.name != "") {
		fetch("/new-channels", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(channel),
		})
			.then((res) => console.log(res))
			.then((data) => (window.location.href = "/dashboard"));
	}
};

// const loadChannel = (id) => {
// 	fetch(`/channels/${id}`)
// 		.then((res) => res.json())
// 		.then((channel) => {
// 			document.getElementById("mainheader").innerHTML = channel.name;
// 			console.log(channel)
// 			const channel_messages = document.getElementById("channel_messages");
// 			for (message of channel.messages) {
// 				let message_el = `
//                 <div class="col">
//                     <div class="border border-secondary">
//                     <strong>${message.user}</strong> ${message.date.toLocaleString()}
//                     <p>${message.message}</p>
//                 </div>
//                 </div>
//             `;
// 				channel_messages.innerHTML += message_el;
// 			}
// 		});
// };

// const createChannelMessage = () => {
// 	const channel_message = {
// 		message: document.getElementById("channel_message").value,
// 	};
// 	if (channel.name != "") {
// 		fetch("/new-channels", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(channel),
// 		})
// 			.then((res) => console.log(res))
// 			.then((data) => (window.location.href = "/dashboard"));
// 	}
// };

loadChannels();
