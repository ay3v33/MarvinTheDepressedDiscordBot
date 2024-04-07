const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rephrase')
		.setDescription('change the phrase you created')
		.addStringOption(option =>
			option
				.setName('phrase')
				.setDescription('The phrase you set for the message.')
				.setRequired(true)
		).addStringOption(option =>
			option
				.setName('new_phrase')
				.setDescription('The new phrase')
				.setRequired(true)
		),
	async execute(interaction) {
		const phrase = interaction.options.getString('phrase');
        const newPhrase = interaction.options.getString('new_phrase');
        const data = await Guild.findOne({ where: { phrase: phrase } });
        const useridInDB = data.dataValues.userid;
        if(data != null){
            if(interaction.user.id == useridInDB) {
                await Guild.findOrCreate({where: {userid: data.userid, username: data.username, imglink: data.imglink, phrase: newPhrase, usersentid: data.usersentid}});
                data.destroy();
                interaction.reply('In progress');
            }
            else {
                interaction.reply('You don\'t have permission buster');
            }
        }
        else{
            interaction.reply('That phrase doesn\'t exist');
        }
	},
};