const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('svimg')
		.setDescription('Saves the previously posted image into the server\'s database.')
        .addStringOption(option =>
			option
				.setName('tag')
				.setDescription('Codename of image.')
				.setRequired(true)),
	async execute(interaction) {
		const tag = interaction.options.getString('tag');
        const img = 'dummyurl';

        await Guild.findOrCreate({where: {tag: tag, img: img}});

        await interaction.reply('Image saved as ' + tag + '!');
	},
};