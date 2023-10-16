const { SlashCommandBuilder, GuildExplicitContentFilter } = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('saveimg')
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
		const phraseCheck = await Guild.findOne({ where: { phrase: phrase } });
		let msgarr = [];
		let count = interaction.options.getInteger('countup');
		let msgcontent = '';

		if(phrase != phraseCheck && count<50) {

			interaction.channel.messages.fetch().then((messages) => {
				//console.log(interaction.user.username);
				msgarr = Array.from(messages.values());
				msgcontent = msgarr[count-1].content;
				console.log(msgcontent);
				
			});
			//await Guild.findOrCreate({where: {tag: tag, img: img}});
			interaction.reply(`Image url saved as ${phrase}`);

			
		} else if(count >= 50) {
			interaction.reply('That is not less than 50 pal');
		} else {
			interaction.reply('That phrase is already being used buddy');
		}
	},
};
