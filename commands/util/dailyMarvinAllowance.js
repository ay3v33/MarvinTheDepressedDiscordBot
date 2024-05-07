const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/econ');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dailymarvinallowance')
		.setDescription('Get your daily fix of marvincoins'),
	async execute(interaction) {
		const userObj = interaction.user;
		const userid = userObj.id;

		try {
			await interaction.deferReply();
			let userProfile = await Guild.findByPk(userid);
			const currentDate = new Date().toDateString();

			if(userProfile) {
				const lastDailyDate = userProfile.lastDailyCollected.toDateString();
				if(lastDailyDate === currentDate) {
					await interaction.editReply("You already collected your daily, try again tomorrow fool.");
					return;
				}
	
				
			} else {
				userProfile = await Guild.create({
					userid: userid,
					username: userObj.username,
					marvincoinBalance: 0,
					lastDailyCollected: null,
				});
			}
			await Guild.update(
				{ marvincoinBalance: userProfile.marvincoinBalance + 42, lastDailyCollected: currentDate },
				{ where: { userid: userid } }
			);
			await interaction.editReply(userObj.username + " collected 42 marvincoins");
		} catch(err) {
			console.log(err);
			await interaction.editReply(userObj.username + "an error occurred blame Aidan not me");
		}
	},
};