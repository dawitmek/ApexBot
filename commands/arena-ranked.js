const { SlashCommandBuilder } = require('@discordjs/builders');
const { API_KEY } = require('../apex-api.json');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('map-ar-ranked')
		.setDescription('Replies with information about Apex Legends current map!'),
	async execute(interaction) {
        var XMLHttpRequest = require('xhr2');
        var http = new XMLHttpRequest();

        http.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(http.responseText);
                interaction.reply(
                    `Current Ranked Arenas Map: ${obj.arenasRanked.current.map}\nTime Left: ${calcTime(obj.arenasRanked.current.remainingSecs)}\n\nNext Map: ${obj.arenasRanked.next.map}
                    `);
            }
        }
        http.open("GET", `https://api.mozambiquehe.re/maprotation?auth=${API_KEY}&version=2`, true);
        http.send();
	}
};

function calcTime(time) {
	var hours = Math.floor(time/3600%60);
	var minutes = Math.floor(time/60%60);
	var seconds = Math.floor(time%60);
	return hours +'h: ' + minutes +'m: ' + seconds+'s';
}