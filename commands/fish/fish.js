const { SlashCommandBuilder } = require('discord.js');
const Fish = require('../../models/fish');
const parsem = require('parse-ms-2');
let limit = 1;
let timeLeft = 0;
let lastUsed = '';

const wait = ms => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const randint = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fish')
		.setDescription('Catch a fish and see what you get. (10 uses per hour)'),
	async execute(interaction) {
		const cooldown = 3600000; //1 Hour
		let fishArray = 0;

		Fish.findAll()
		.then(id => {
				fishArray = id.map(id => id.toJSON());
				fishArray = fishArray.length;
				fish();
		})
			.catch(err => {
				console.error('Error fetching ids:', err);
		});

		async function fish(){
			let random = randint(1, fishArray);
			let data = await Fish.findOne({where: { id: random }});
			let fishName = data.name;
			
			if(limit > 0){
				if(timeLeft == 0){
					limit--;
					await interaction.reply('You\'ve caught a/an ' + fishName + '! You have ' + limit + ' casts left!');
					lastUsed = Date.now();
				}
				else {
					await interaction.reply('You have no more casts left!');
				}
			} else {
				timeLeft = cooldown - (Date.now() - lastUsed);
				console.log(timeLeft);
				let { hours, minutes, seconds } = parsem(timeLeft);
				await interaction.reply('Time remaining until fishing reset: ' + hours + 'hrs ' + minutes + 'mins ' + seconds + 'secs left.');
			}
		}
	},
};