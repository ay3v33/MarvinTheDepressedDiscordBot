const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/guild');
const sequelize = require('../../utils/database');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rmuser')
		.setDescription('remove a user from the DB')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('User you want to remove from the DB')
				.setRequired(true)
		),
	async execute(interaction) {
		const userObj = interaction.options._hoistedOptions[0].user;
		//const guild = await Guild.findOrCreate({ where: { id: userObj.id, username: userObj.username}});
        await Guild.destroy({
            where: {id: userObj.id}
        });
        interaction.reply('worked');
	},
};