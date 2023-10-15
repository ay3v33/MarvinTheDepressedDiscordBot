const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adduser')
		.setDescription('add a user to the db')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('User you want to add to the DB')
				.setRequired(true)
		),
	async execute(interaction) {
		const userObj = interaction.options._hoistedOptions[0].user;
		await Guild.findOrCreate({ where: { id: userObj.id, username: userObj.username}});
        interaction.reply('worked');
	},
};