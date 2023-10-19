const { SlashCommandBuilder } = require('discord.js');
const Econ = require('../../models/econ');
const parsem = require('parse-ms-2');
const dailyMin = 1;
const dailyMax = 10;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('collect')
		.setDescription('Collect daily schmeckels'),
	async execute(interaction, profileData) {
        const userid = interaction.user.id;
        const data = await Econ.findOne({ where: { userid: userid } });
        const dailyLastUsed = data.lastDailyCollected;
        const cooldown = 86400000;
        const timeLeft = cooldown - (Date.now() - dailyLastUsed);
        if(timeLeft > 0) {
            await interaction.deferReply({ephemeral: true});
            const { hours, minutes, seconds } = parsem(timeLeft);
            await interaction.editReply(`Claim your next daily in ${hours} hrs ${minutes} mins ${seconds} sec`);
        } else {
            await interaction.deferReply();
            const randAmt = Math.floor(Math.random()*(dailyMax-dailyMin+1 )+dailyMin);
            try {
                data.schmeckels += randAmt;
                data.lastDailyCollected = Date.now();
                await data.save();
                await interaction.editReply(`You collected ${randAmt}`);
            } catch {
                console.log(err);
            }
        } 
	},
};