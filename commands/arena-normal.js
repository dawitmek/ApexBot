const { SlashCommandBuilder } = require('@discordjs/builders');
const API_KEY = process.env.APEX_API_KEY;
const fetch = require('node-fetch');
const lib = require('../library.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('map-ar')
        .setDescription('Replies with information about Apex Legends current map!'),
    async execute(interaction) {
        fetch(`https://api.mozambiquehe.re/maprotation?auth=${API_KEY}&version=2`)
            .then(data => data.json())
            .then(obj => {
                let newEmbed = lib.createEmbed('Current Map Rotation for Normal Arenas', [
                    { name: 'Current Map:', value: obj.arenas.current.map },
                    { name: 'Time Left:', value: lib.calcTime(obj.arenas.current.remainingSecs) },
                    { name: 'Next Map:', value: obj.arenas.next.map }
                ], obj.arenas.current.asset, false);
                interaction.reply({ embeds: [newEmbed], ephemeral: false })

            })
    }
};