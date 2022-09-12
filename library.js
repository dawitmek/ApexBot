const { MessageEmbed } = require("discord.js");

function createEmbed(title, content, img, time) {
    let embed = new MessageEmbed()
        .setColor("#ff4747")
        .setTitle(title)
        .addFields(content)
        .setImage(img);
    time ? embed.setTimestamp() : '';

    return embed;
}


function calcTime(time) {
    var hours = Math.floor(time / 3600 % 60);
    var minutes = Math.floor(time / 60 % 60);
    var seconds = Math.floor(time % 60);
    return hours + 'h: ' + minutes + 'm: ' + seconds + 's';
}

module.exports = {
    createEmbed,
    calcTime
}