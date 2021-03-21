const channelList = document.getElementById("channel_list")
const loadChannels = () => {
	fetch("/channels/")
		.then((res) => res.json())
		.then((channels) => {
			for (channel of channels) {
				let channelElement = document.createElement("table");
				channelElement.className = "table table-dark table-hover";
				channelElement.innerHTML = `
                    <tbody>
                        <tr>
                        <td><a class="text-decoration-none" href="/channels/${channel._id}"># ${channel.name}</a></td>
                        </tr>
                    </tbody>
                `;
				channelList.appendChild(channelElement);
			}
		});
};

// Channel Submit
const channelForm = document.getElementById("channel_form");

channelForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const channel = {
		name: e.target.elements.channel_name.value,
		description: e.target.elements.channel_description.value,
	};
	fetch("/channels/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(channel),
	})
    .then(res => console.log(res))
    .then(() => window.location.href = "/dashboard")
});

loadChannels();
