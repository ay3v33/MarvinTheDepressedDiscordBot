const { SlashCommandBuilder } = require('discord.js');

const randint = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

let VALS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
let SUITES = ['spades', 'clubs', 'hearts', 'diamonds'];
let deck = [];

const createDeck = () => {
	for(i=0;i<SUITES.length;i++) {
		for(j=0;j<VALS.length;j++) {
			deck.push(`${VALS[j]} of ${SUITES[i]}`);
		}
	}
}

const shuffle = arr => {
	let currentIndex = arr.length,  randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[arr[currentIndex], arr[randomIndex]] = [
		arr[randomIndex], arr[currentIndex]];
	}
	return arr;
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Play blackjack with one schmeckel'),
	async execute(interaction) {
        
	},
};