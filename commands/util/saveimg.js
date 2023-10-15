const { SlashCommandBuilder, GuildExplicitContentFilter } = require('discord.js');
const Sequelize = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('saveimg')
		.setDescription('clears entered number of chats in the channel used')
		.addStringOption(option =>
			option
				.setName('imglink')
				.setDescription('image link')
				.setRequired(true)
		)
        .addStringOption(option =>
			option
				.setName('phrase')
				.setDescription('phrase')
				.setRequired(true)
		),
	async execute(interaction) {
		const imglink = interaction.options.getInteger('imglink');
        const phrase = interaction.options.getInteger('phrase');
        

	},
};
