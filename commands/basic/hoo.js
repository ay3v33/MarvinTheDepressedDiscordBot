const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hoo')
		.setDescription('Replies with Rah!'),
	async execute(interaction) {
		await interaction.reply('Rah!');
	},
};
