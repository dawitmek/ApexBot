// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { API_KEY } = require('./apex-api.json');

// Create a new client instance Discord.js
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

function calcTime(time) {
	var hours = Math.floor(time/3600%60);
	var minutes = Math.floor(time/60%60);
	var seconds = Math.floor(time%60);
	return hours +'h: ' + minutes +'m: ' + seconds+'s';
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


// When the client is ready, run this code (only once) Discord.js
client.once('ready', () => {
	console.log('Ready from discord.js!');
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return false; 
  
  if (message.content.substring(0, 2) == "a!") {
	var args = message.content.substring(2).split(" ");
	console.log(args);

	var cmd = args[0];

	switch (cmd) {
		case "map":
			var XMLHttpRequest = require('xhr2');
			var http = new XMLHttpRequest();

			http.onreadystatechange = function () {
				if(this.readyState == 4 && this.status == 200) {
					var obj = JSON.parse(http.responseText);
					console.log(args);
					if(args[1] == 'ar') {

					  if(args[2] === 'ranked') {
						message.channel.send(
							`Current Ranked Arenas Map: ${obj.arenasRanked.current.map}\nTime Left: ${calcTime(obj.arenasRanked.current.remainingSecs)}\n\nNext Map: ${obj.arenasRanked.next.map}
						  `,
						);
					  } else {
						message.channel.send(
							`Current Arenas Map: ${obj.arenas.current.map}\nTime Left: ${calcTime(obj.arenas.current.remainingSecs)}\n\nNext Map: ${obj.arenas.next.map}
						  `,);
					  }
					} else {
						message.channel.send(
							`Current Map: ${obj.battle_royale.current.map}\nTime Left: ${calcTime(obj.battle_royale.current.remainingSecs)}\n\nNext Map: ${obj.battle_royale.next.map}
						  `,);
					}
				}
			}
			http.open("GET", `https://api.mozambiquehe.re/maprotation?auth=${API_KEY}&version=2`, true);
			http.send();
			break;
	}
  }
});
//	Discord.js
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);