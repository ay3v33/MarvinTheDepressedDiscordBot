const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('av')
		.setDescription('displays @users avatar')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The users avatar you want to print')
				.setRequired(true)
		),
	async execute(interaction) {
		const userID = interaction.options._hoistedOptions[0].user.id;
		userObj = interaction.client.users.cache.find(user => user.id === userID)
		await interaction.reply(userObj.displayAvatarURL());
	},
};