const { SlashCommandBuilder, GuildExplicitContentFilter } = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('savemsg')
		.setDescription('saves imglink')
        .addIntegerOption(option =>
			option
				.setName('countup')
				.setDescription('how many messages up is the image(less than 50)')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('phrase')
				.setDescription('phrase')
				.setRequired(true)
		),
	async execute(interaction) {
		//const imglink = 'test'
        const phrase = interaction.options.getString('phrase');
		const data = await Guild.findOne({ where: { phrase: phrase } });
		let phraseCheck = '';
		if(data != null) {
			phraseCheck = data.dataValues.phrase;
		}
		let msgarr = [];
		let count = interaction.options.getInteger('countup');
		let msgcontent = '';
		let urssentid = '';

		
		if(phrase != phraseCheck && count<50) {

			interaction.channel.messages.fetch().then(async (messages) => {
				msgarr = Array.from(messages.values());
				msgcontent = msgarr[count-1].content;
				urssentid = msgarr[count-1].author.id;
				await Guild.findOrCreate({where: {userid: interaction.user.id, username: interaction.user.username, imglink: msgcontent, phrase: phrase, usersentid: urssentid}});
			});
			
			
			interaction.reply(`Message saved as ${phrase}`);

			
		} else if(count >= 50) {
			interaction.reply('That is not less than 50 pal');
		} else {
			interaction.reply('That phrase is already being used buddy');
		}
	},
};
