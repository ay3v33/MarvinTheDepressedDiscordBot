const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/econ');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('donate')
		.setDescription('Donate marvincoins to someone')
        .addUserOption(option =>
			option
				.setName('target')
				.setDescription('The user you want to donate to')
				.setRequired(true)
		)
        .addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('Amount you want to donate')
				.setRequired(true)
		),
	async execute(interaction) {
		try {
            const senderUserObj = interaction.user;
            const receiverUserObj = interaction.options._hoistedOptions[0].user;
            const senderUserid = senderUserObj.id;
            const receiverUserid = receiverUserObj.id;
            amnt = interaction.options.getInteger('amount');
            let senderUserProfile = await Guild.findByPk(senderUserid);
            let receiverUserProfile = await Guild.findByPk(receiverUserid);
            
             {
                if(amnt > 0 && senderUserProfile.marvincoinBalance >= amnt) {
                    if(receiverUserProfile) {
                        await Guild.update(
                            { marvincoinBalance: receiverUserProfile.marvincoinBalance + amnt },
                            { where: { userid: receiverUserid } }
                        );
                        await Guild.update(
                            { marvincoinBalance: senderUserProfile.marvincoinBalance - amnt },
                            { where: { userid: senderUserid } }
                        );
                        interaction.reply(`${senderUserObj.username} donated ${amnt} marvincoins to ${receiverUserObj.username}`);
                    } else {
                        userProfile = await Guild.create({
                            userid: receiverUserObj,
                            username: receiverUserObj.username,
                            marvincoinBalance: amnt,
                            lastDailyCollected: null,
                        });
                    }
                } else {
                    interaction.reply('kys');
                }
            }
        } catch (err) {
            console.log(err);
        }
        
	},
};