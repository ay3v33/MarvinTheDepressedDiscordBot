const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('savemsg')
		.setDescription('saves imglink with count-up or id')
        .addStringOption(option =>
			option
				.setName('countorid')
				.setDescription('how many messages up is t(less than 10) or message ID')
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
		let count = interaction.options.getString('countorid');
		let countAsInt = 0;
		if(count.length < 2) {
			countAsInt = parseInt(count);
		} else {
			countAsInt = 10;
		}
		let msgcontent = '';
		let urssentid = '';
		if(phrase != phraseCheck) {
			if(countAsInt<10) {

				interaction.channel.messages.fetch().then(async (messages) => {
					msgarr = Array.from(messages.values());
					msgcontent = msgarr[count-1].content;
					urssentid = msgarr[count-1].author.id;
					await Guild.findOrCreate({where: {userid: interaction.user.id, username: interaction.user.username, imglink: msgcontent, phrase: phrase, usersentid: urssentid}});
				});
				
				interaction.reply(`Message saved as ${phrase}`);
			} else if(countAsInt >= 10) {
				console.log(count);
				try {
					const fetchedMessage = await interaction.channel.messages.fetch(count);
					await Guild.findOrCreate({where: {userid: interaction.user.id, username: interaction.user.username, imglink: fetchedMessage.content, phrase: phrase, usersentid: urssentid}});
					interaction.reply(`Message saved as ${phrase}`);
				} catch (err) {
					console.log(err);
					interaction.reply('That id doesn\'t exist bud');
				}
			}
		} else {
			interaction.reply('That phrase is already being used pal')
		}
	},
};
