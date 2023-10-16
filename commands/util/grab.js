const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/guild');

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
		const phraseOp = interaction.options.getString('phrase');
		const data = await Guild.findOne({ where: { phrase: phraseOp } });
		let msglink = '';
		let public = '';

		if(data != null) {
			msglink = data.dataValues.imglink;
			public = data.dataValues.public;
			if(public) {
				await interaction.reply(msglink);
			}
			else {
				await interaction.reply('Access denied buster!');
			}
		}
		else {
			await interaction.reply('This phrase doesn\'t exist bozo.');
		}
	},
};