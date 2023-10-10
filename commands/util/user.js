const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.')
		.addUserOption(option =>
			option
			.setName('username')
			.setDescription('The users avatar you want to print')),
	async execute(interaction) {
		const uname = interaction.options.getUser('username');
		
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
		
	}
};