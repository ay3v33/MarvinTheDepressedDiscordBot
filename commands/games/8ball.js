const { SlashCommandBuilder } = require('discord.js');

const randint = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask a question, and you\'ll recieve an answer.')
        .addStringOption(option =>
			option
				.setName('question')
				.setDescription('The question you ask the 8ball.')),
	async execute(interaction) {
        const q = interaction.options.getString('question');
        let x = ['yes', 'no', 'it is certain', 'without a doubt', 'most likely', 'don\'t count on it', 'my sources say no', 'outlook not so good', 'reply hazy, try again', 'ask again later', 'cannot predict now', 'concentrate and ask again'];
		await interaction.reply(x[randint(0, x.length-1)]);
	},
};