const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply(`Pong! oh wait... Latency is ${Date.now() - interaction.createdTimestamp}ms.`);
	},
};
