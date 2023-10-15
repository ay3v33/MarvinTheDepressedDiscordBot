const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vowels')
		.setDescription('Finds the number of vowels (aeiou) in a sentence.')
        .addStringOption(option =>
			option
				.setName('string')
				.setDescription('Say anything.')
                .setRequired(true)),
	async execute(interaction) {
        const q = interaction.options.getString('string');
        let valcnt = 0;

		for(let i = 0; i <= q.length; i++){
            if(q.charAt(i) == 'a' || q.charAt(i) == 'A' || q.charAt(i) == 'e' || q.charAt(i) == 'E' || q.charAt(i) == 'i' || q.charAt(i) == 'I' || q.charAt(i) == 'o' || q.charAt(i) == 'O' || q.charAt(i) == 'u' || q.charAt(i) == 'U'){
                valcnt++;
            }
        }

        if(valcnt == 0){
            await interaction.reply('No Vowels');
        }
        else if(valcnt == 1){
            await interaction.reply('1 Vowel');
        }
        else{
            await interaction.reply(valcnt + ' Vowels');
        }
	},
};