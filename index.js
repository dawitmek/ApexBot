// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, Intents } = require('discord.js');

const Discord = require("discord.io");
const { token } = require('./config.json');

const bot = new Discord.Client({
	token: token,

	autorun: true,
})
// Create a new client instance Discord.js
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Discord.io
bot.on("ready", function(evt) {
	console.log('Ready from Discord.io.');
});

function calcTime(time) {
	var hours = Math.floor(time/3600%60);
	var minutes = Math.floor(time/60%60);
	var seconds = Math.floor(time%60);
	return hours +'h: ' + minutes +'m: ' + seconds+'s';
}

bot.on("message", function (user, userID, channelID, message, evt) {
	// Our bot needs to know if it will execute a command
  
	// It will listen for messages that will start with `!`
  
	if (message.substring(0, 2) == "a!") {
	  var args = message.substring(2).split(" ");
	  console.log(args);
  
	  var cmd = args[0];
  
	  switch (cmd) {
		  case "map":
			  const API_KEY = "eada3f695e72a1c2b6e07229190c846a";
			  var XMLHttpRequest = require('xhr2');
			  var http = new XMLHttpRequest();
  
			  http.onreadystatechange = function () {
				  if(this.readyState == 4 && this.status == 200) {
					  var obj = JSON.parse(http.responseText);
					  console.log(args);
					  if(args[1] == 'ar') {
						if(args[2] === 'ranked') {
						  bot.sendMessage({
							to: channelID,
							message: `Current Ranked Arenas Map: ${obj.arenasRanked.current.map}\nTime Left: ${calcTime(obj.arenasRanked.current.remainingSecs)}\n\nNext Map: ${obj.arenasRanked.next.map}
							`,
						  });
						} else {
						  bot.sendMessage({
							to: channelID,
							message: `Current Arenas Map: \n${obj.arenas.current.map}\nTime Left: ${calcTime(obj.arenas.current.remainingSecs)}\n\nNext Map: ${obj.arenas.next.map}
							`,
						  });
						}
					  } else {
						bot.sendMessage({
							to: channelID,
							message: `Current Map: ${obj.battle_royale.current.map}\nTime Left: ${calcTime(obj.battle_royale.current.remainingSecs)}\n\nNext Map: ${obj.battle_royale.next.map}
							`,
						});
					  }
				  }
			  }
			  http.open("GET", `https://api.mozambiquehe.re/maprotation?auth=${API_KEY}&version=2`, true);
			  http.send();
			  break;
	  }
	}
  });

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