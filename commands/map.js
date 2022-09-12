const { SlashCommandBuilder } = require('@discordjs/builders');
const API_KEY = process.env.APEX_API_KEY;
const fetch = require('node-fetch');
const lib = require('../library.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('map')
        .setDescription('Replies with information about Apex Legends current map!'),
    async execute(interaction) {
        fetch(`https://api.mozambiquehe.re/maprotation?auth=${API_KEY}&version=2`)
            .then(data => data.json())
            .then(obj => {
                let newEmbed = lib.createEmbed('Current Map Rotation for Casual Apex', [
                    { name: 'Current Map:', value: obj.battle_royale.current.map },
                    { name: 'Time Left:', value: lib.calcTime(obj.battle_royale.current.remainingSecs) },
                    { name: 'Next Map:', value: obj.battle_royale.next.map }
                ], obj.battle_royale.current.asset, false);
                interaction.reply({ embeds: [newEmbed], ephemeral: false })
            })
    }
};