/************************* CHANNELS *****************************/

const channelList = document.getElementById("channel_list");
const privateList = document.getElementById("private_list");

const loadRooms = () => {
	fetch("/channels/")
		.then((res) => res.json())
		.then((rooms) => {
			for (room of rooms) {
				if ((room.private == false)) {
					let channelElement = document.createElement("table");
					channelElement.className = "table table-dark table-hover";
					channelElement.innerHTML = `
                    <tbody>
                        <tr>
                        <td><a class="text-decoration-none" href="/channels/${room._id}"># ${room.name}</a></td>
                        </tr>
                    </tbody>
                `;
					channelList.appendChild(channelElement);
				} else {
					let chatElement = document.createElement("table");
					chatElement.className = "table table-dark table-hover";
					chatElement.innerHTML = `
                    <tbody>
                        <tr>
                        <td><a class="text-decoration-none" href="/channels/${room._id}"># ${room.name}</a></td>
                        </tr>
                    </tbody>
                `;
					privateList.appendChild(chatElement);
				}
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
		.then((res) => console.log(res))
		.then(() => (window.location.href = "/dashboard"));
});

/************************* PRIVATE *****************************/

// Chat Submit
const privateForm = document.getElementById("private_form");

privateForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const private = {
		user: e.target.elements.users.value,
		userName: document.getElementById(`${e.target.elements.users.value}`).innerHTML,
	};
	fetch("/channels/private/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(private),
	})
		.then((res) => console.log(res))
		.then(() => (window.location.href = "/dashboard"));
});

loadRooms();
