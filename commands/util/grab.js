const { SlashCommandBuilder } = require('discord.js');
const Sequelize = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('grab')
		.setDescription('Grabs message from database.')
		.addStringOption(option =>
			option
				.setName('phrase')
				.setDescription('The phrase you set for the message.')
				.setRequired(true)
		),
	async execute(interaction) {
		
		await interaction.reply('in progress');
	},
};