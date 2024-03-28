const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('myphrases')
		.setDescription('Lists your phrases '),
	async execute(interaction) {
		await interaction.reply('Doesn\'t work yet');
	},
};
