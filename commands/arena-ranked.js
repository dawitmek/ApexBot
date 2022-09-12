const { SlashCommandBuilder } = require('@discordjs/builders');
const API_KEY = process.env.APEX_API_KEY;
const fetch = require('node-fetch');
const lib = require('../library.js')
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('map-ar-ranked')
        .setDescription('Replies with information about Apex Legends current map!'),
    async execute(interaction) {
        fetch(`https://api.mozambiquehe.re/maprotation?auth=${API_KEY}&version=2`)
            .then(data => data.json())
            .then(obj => {
                let newEmbed = lib.createEmbed('Current Map Rotation for Ranked Arenas', [
                    { name: 'Current Map:', value: obj.arenasRanked.current.map },
                    { name: 'Time Left:', value: lib.calcTime(obj.arenasRanked.current.remainingSecs) },
                    { name: 'Next Map:', value: obj.arenasRanked.next.map }
                ], obj.arenasRanked.current.asset, false);

                interaction.reply({ embeds: [newEmbed], ephemeral: false });
            })
    }
};