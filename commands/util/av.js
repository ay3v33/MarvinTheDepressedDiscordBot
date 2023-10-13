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
		const userObj = interaction.options._hoistedOptions[0].user;
		//userObj = interaction.client.users.cache.find(user => user.id === userID);
		console.log(userObj.id);
		if(userObj.id != '1144772464623231067') {
			await interaction.reply(userObj.displayAvatarURL());
		} else {
			await interaction.reply('Nah');
		}
	},
};