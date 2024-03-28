const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hoo')
		.setDescription('Replies with Rah!'),
	async execute(interaction) {
		console.log(interaction.user.username);
		await interaction.reply('Rah!');
	},
};
