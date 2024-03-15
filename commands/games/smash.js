const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('smashorpass')
		.setDescription('Marvin decides if he wants to smash or pass'),

	async execute(interaction) {
        const randomnum = Math.random();
        if(randomnum == 0) {
            await interaction.reply('Smash');
        } else {
            await interaction.reply('Pass');
        }
	},
};