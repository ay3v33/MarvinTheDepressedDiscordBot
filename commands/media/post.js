const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('post')
		.setDescription('Post a message from database.')
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
		let usrsentid = '';
		let usrsent = '';
		let createdAt = '';

		if(data != null) {
			usrsentid = data.dataValues.usersentid;
			usrsent = interaction.client.users.cache.find(user => user.id === usrsentid);
			createdAt = data.dataValues.createdAt;
			msglink = data.dataValues.imglink;
			createdAt = createdAt.toString();
			await interaction.reply(`${msglink} - ${usrsent} \nSaved on ${createdAt.slice(0, 15)}`);
		}
		else {
			await interaction.reply('This phrase doesn\'t exist bozo.');
		}
	},
};