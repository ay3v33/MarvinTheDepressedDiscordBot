const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/econ');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('View your balance of marvincoins'),
	async execute(interaction) {
		const userObj = interaction.user;
		const userid = userObj.id;
        let userProfile = await Guild.findByPk(userid);
        interaction.reply(`Your balance is ${userProfile.marvincoinBalance}`);
	},
};