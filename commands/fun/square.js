const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('square')
		.setDescription('Ask a question, and you\'ll recieve an answer.')
        .addIntegerOption(option =>
			option
				.setName('width')
				.setDescription('Width of square.')
                .setRequired(true))
        .addIntegerOption(option =>
                    option
                        .setName('height')
                        .setDescription('Height of square.')
                        .setRequired(true)),
	async execute(interaction) {
        const w = interaction.options.getInteger('width');
        const h = interaction.options.getInteger('height');
        let sw = '';

		for(let i = 1; i <= h; i++){
            for(let j = 1; j <= w; j++){
                sw += '# ';
            }
            sw += '\n';
        }

        if(w > 15 || h > 15){
            await interaction.reply("That square too damn big!");
        }
        else{
            await interaction.reply(sw);
        }
	},
};