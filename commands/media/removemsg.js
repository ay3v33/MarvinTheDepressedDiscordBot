const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removemsg')
		.setDescription('Removes a message from database.')
		.addStringOption(option =>
			option
				.setName('phrase')
				.setDescription('Phrase in database.')
				.setRequired(true)
		),
	async execute(interaction) {
		const phrase = interaction.options.getString('phrase');
        const data = await Guild.findOne({ where: { phrase: phrase } });
		let usrperm = '';
		const user = await interaction.user.id;
		
		if(data != null) {
			usrperm = data.dataValues.userid
			if(usrperm == user){
				data.destroy();
				await interaction.reply(phrase + ' no longer exists.');
			}
			else {
				await interaction.reply('Access denied!');
			}
		}
		else {
			await interaction.reply('Phrase doesn\'t exist!');
		}
}};