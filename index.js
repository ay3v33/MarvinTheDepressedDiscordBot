const fs = require('fs');
const path = require('path')
const { Client, Events, GatewayIntentBits, Collection, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
require('dotenv').config();
const { getXMedia, sendXMedia } = require('./socialMediaGrabbers/x.js');
const { getTokMedia, sendTokMedia } = require('./socialMediaGrabbers/tt.js');
const { getIGMedia, sendIGMedia } = require('./socialMediaGrabbers/insta.js');
const Guild = require('./models/econ');
const Queue = require('./socialMediaGrabbers/Queue.js');
const queue = new Queue();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
    ]
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

function randNum(min, max) {
    // Generate a random number between 0 and 1
    const random = Math.random();

    // Scale the random number to fit within the desired range
    const scaled = random * (max - min + 1);

    // Shift the result to start from the minimum value
    const result = Math.floor(scaled) + min;

    return result;
}

const handleMedia = async (Q, msg) => {
	let flpth = '';
	if(Q.front().startsWith('https://twitter.com') || Q.front().startsWith('https://x.com')) {
		deleteMedia();
		getXMedia(Q.front());
		await new Promise(r => setTimeout(r, 6250));
		flpth = await sendXMedia();
		await msg.channel.send({
			content:
				``,
			files: [flpth]
		}).catch((err) => {
				console.log("Error during Export File " + err);
		});
	} else if(Q.front().startsWith('https://www.tiktok.com')) {
		deleteMedia();
		getTokMedia(Q.front());
		await new Promise(r => setTimeout(r, 6250));
		flpth = await sendTokMedia();
		await msg.channel.send({
			content:
				``,
			files: [flpth]
		}).catch((err) => {
				console.log("Error during Export File " + err);
		});
	} else if(Q.front().startsWith('https://www.instagram.com')) {
		deleteMedia();
		getIGMedia(Q.front());
		await new Promise(r => setTimeout(r, 6250));
		flpth = await sendIGMedia();
		await msg.channel.send({
			content:
				``,
			files: [flpth]
		}).catch((err) => {
				console.log("Error during Export File " + err);
		});
	}
	
	deleteMedia();
	await new Promise(r => setTimeout(r, 10000));
	console.log('waited 10');
	Q.dequeue();
	if(!Q.isEmpty()) {
		handleMedia(Q, msg);
	}
}

const deleteMedia = () => {
	try {
        const directoryPath = path.join(__dirname, 'socialMediaGrabbers', 'downloadedLinks');
        const files = fs.readdirSync(directoryPath);

        if (files.length === 0) {
            console.log('No files to delete in the directory');
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);

            fs.unlink(filePath, err => {
                if (err) {
                    console.error(`Error deleting the file ${file}:`, err);
                } else {
                    console.log(`File ${file} deleted successfully`);
                }
            });
        });
    } catch (error) {
        console.error('Error deleting files:', error);
    }
}

const slotsItemsArr = [':smiling_imp:', ':sweat_drops:', ':eggplant:', ':skull:'];

class Card {
	constructor(suit, rank) {
		this.suit = suit;
		this.rank = rank;
	}
}

function selectRandomSuit() {
	const suits = ['♦️', '♥️', '♠️', '♣️'];
	return suits[Math.floor(Math.random() * suits.length)];
}

function generateCard() {
	const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	return new Card(selectRandomSuit(), cards[Math.floor(Math.random() * cards.length)]);
}

function calculateHandValue(hand) {
	let sum = 0;
	let numAces = 0;

	for (const card of hand) {
		if (card.rank === 'A') {
			numAces++;
			sum += 11;
		} else if (['J', 'Q', 'K'].includes(card.rank)) {
			sum += 10;
		} else {
			sum += parseInt(card.rank);
		}
	}

	// Adjust for aces
	while (sum > 21 && numAces > 0) {
		sum -= 10;
		numAces--;
	}

	return sum;
}

// Function to display the current hand and value
function displayHand(hand, hideFirstCard = false) {	
	if (hideFirstCard) {
		return `Hand: ${hand[1].rank} ${hand[1].suit} [?]`;
	} else {
		let handstr = ``;
		for(let i=0;i<hand.length; i++) {
			handstr += `${hand[i].rank} ${hand[i].suit} `
		}
		return `Hand: ` + handstr;
	}
}

function isBlackjack(hand) {
	return hand.length === 2 && calculateHandValue(hand) === 21;
}

client.on('messageCreate', async msg => {
	if(msg.author.bot) return;
	let userid = msg.author.id;
	
	const urlRegex = /(?:^|\/)(https?:\/\/[^\s]+)/gi;
	const messageContent = msg.content;
	let matchedLinks = messageContent.match(urlRegex);
	let linkmsg = false;
	try {
		if(matchedLinks != null && msg.content[0] == '/') {
			matchedLinks = matchedLinks.map(str => str.slice(1));
			linkmsg = true;
			for(let i=0;i<matchedLinks.length;i++){
				queue.enqueue(matchedLinks[i]);
			}
			handleMedia(queue, msg);
		}
	} catch (err) {
		console.log(err);
	}
	

	if(msg.content.toLowerCase() == '/gamble') {
		msg.reply('use \'/slots\' to play slots ');
	}

	if(msg.content.toLowerCase() == '/slots') {
			let amntWon = 0;
			let multiplier = 1;
			try {
				const spin = new ButtonBuilder()
				.setLabel('spin')
				.setStyle(ButtonStyle.Success)
				.setCustomId('spin')

				const quit = new ButtonBuilder()
				.setLabel('quit')
				.setStyle(ButtonStyle.Danger)
				.setCustomId('quit')

			const buttonRow = new ActionRowBuilder().addComponents(spin, quit);

			const reply = await msg.reply({ content: 'Get three in a row to win 3 marvin coins\nEggplants have a 4x multiplier\neach roll cost 1 marvincoin\nX \t X \t X\nX \t X \t X\nX \t X \t X\n', components: [buttonRow] });

			const filter = (i) => i.user.id === msg.author.id;

			const collector = reply.createMessageComponentCollector({
				componentType: ComponentType.Button,
				filter,
			});
			
			
			
			collector.on('collect', async (interaction) => {
				let randArr = ['', '', '', '', '', '', '', '', '',];
				for(let i=0; i<9; i++) {
					let rand = randNum(1, 10);
					if(rand < 3)
						randArr[i] = slotsItemsArr[2];
					else if(rand < 5)
						randArr[i] = slotsItemsArr[1];
					else if(rand < 9) {
						randArr[i] = slotsItemsArr[3];
					}
					else
						randArr[i] = slotsItemsArr[0];
				}
				const  userProfile = await Guild.findByPk(userid);
				
				if (interaction.customId === 'spin') {
					if(userProfile.marvincoinBalance < 1) {
						interaction.reply(`Your balance is ${userProfile.marvincoinBalance} broke boy`);
						return;
					}
					if(randArr[0] == randArr[1] && randArr[0] == randArr[2]) {
						if(randArr[0] == randArr[3] && randArr[0] == randArr[4] && randArr[0] == randArr[5]) {
							if(randArr[0] == randArr[6] && randArr[0] == randArr[7] && randArr[0] == randArr[8]) {
								{
									if(randArr[0] == slotsItemsArr[0]) {
										multiplier = 1;
									} else if(randArr[0] == slotsItemsArr[2]) {
										multiplier = 4;
									}
									amntWon = 3*multiplier*100;
								}
							} else {
								if(randArr[0] == slotsItemsArr[0]) {
									multiplier = 1;
								} else if(randArr[0] == slotsItemsArr[2]) {
									multiplier = 4;
								}
								amntWon = 3*multiplier * 3;
							} 
						} else {
							if(randArr[0] == slotsItemsArr[0]) {
								multiplier = 1;
							} else if(randArr[0] == slotsItemsArr[2]) {
								multiplier = 4;
							}
							amntWon = 3*multiplier;
						}
						
					} else if(randArr[3] == randArr[4] && randArr[3] == randArr[5]) {
						if(randArr[3] == randArr[6] && randArr[3] == randArr[7] && randArr[3] == randArr[8]) {
							if(randArr[3] == slotsItemsArr[0]) {
								multiplier = 1;
							} else if(randArr[3] == slotsItemsArr[2]) {
								multiplier = 4;
							}
							amntWon = 3*multiplier * 3;
						} else {
							if(randArr[3] == slotsItemsArr[0]) {
								multiplier = 1;
							} else if(randArr[3] == slotsItemsArr[2]) {
								multiplier = 4;
							}
							amntWon = 3*multiplier;
						}
					} else if(randArr[6] == randArr[7] && randArr[6] == randArr[8]) {
						if(randArr[6] == slotsItemsArr[0]) {
							multiplier = 1;
						} else if(randArr[6] == slotsItemsArr[2]) {
							multiplier = 4;
						}
						amntWon = 3*multiplier;
					}

					await Guild.update(
						{ marvincoinBalance: userProfile.marvincoinBalance + amntWon - 1},
						{ where: { userid: userid } }
					);

					await interaction.update({ content: `| ${randArr[0]} | ${randArr[1]} | ${randArr[2]}| 
												\n| ${randArr[3]} | ${randArr[4]} | ${randArr[5]}| 
												\n| ${randArr[6]} | ${randArr[7]} | ${randArr[8]}|
												\n You won ${amntWon} marvincoins!`, components: [buttonRow] });
						multiplier = 1;
						amntWon = 0;
						return;
					}
				if (interaction.customId === 'quit') {
					await interaction.update({ content: 'X \t X \t X\nX \t X \t X\nX \t X \t X\n', components: [buttonRow] });
					return;
				}
			})
		} catch(err) {
			console.log(err);
		}
	}

	

	if(msg.content.toLowerCase() == '/blackjack' || msg.content.toLowerCase() == '/bj') {
		try {
			const bet = new ButtonBuilder()
				.setLabel('bet')
				.setStyle(ButtonStyle.Success)
				.setCustomId('bet')
			
			const stand = new ButtonBuilder()
				.setLabel('stand')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('stand')

			const hit = new ButtonBuilder()
				.setLabel('hit')
				.setStyle(ButtonStyle.Primary)
				.setCustomId('hit')
			const end = new ButtonBuilder()
				.setLabel('end')
				.setStyle(ButtonStyle.Danger)
				.setCustomId('end')
				

			let buttonRow = new ActionRowBuilder().addComponents(bet, stand, hit, end);

			const reply = await msg.reply({ content: 'Play blackjack\nmust have at least 15 marvincoins', components: [buttonRow] });

			const filter = (i) => i.user.id === msg.author.id;

			const collector = reply.createMessageComponentCollector({
				componentType: ComponentType.Button,
				filter,
			});
			
			let betphase = true;
			let playerHand = [];
			let dealerHand = [];
			collector.on('collect', async (interaction) => {
				if (interaction.customId === 'bet' && betphase) {
					betphase = false;
					playerHand = [];
					dealerHand = [];

					playerHand.push(generateCard());
					dealerHand.push(generateCard());
					playerHand.push(generateCard());
					dealerHand.push(generateCard());

					await interaction.update({ content: 'Dealer ' + displayHand(dealerHand, true)+'\n'+'Player '+displayHand(playerHand), components: [buttonRow] });
					
				}
				let pHandval = calculateHandValue(playerHand);
				let dHandval = calculateHandValue(dealerHand);
				if (interaction.customId === 'stand' && !betphase) {
					
					while(dHandval < 17) {
						dealerHand.push(generateCard());
						sleep(1500);
						dHandval = calculateHandValue(dealerHand);
					}
					if(dHandval > 21) {
						await interaction.update({ content: 'Dealer ' + displayHand(dealerHand)+'\n'+'Player '+displayHand(playerHand) + '\n You win 30 marvincoins!', components: [buttonRow] });
					} else if(pHandval > dHandval) {
						await interaction.update({ content: 'Dealer ' + displayHand(dealerHand)+'\n'+'Player '+displayHand(playerHand) + '\n You win 30 marvincoins!', components: [buttonRow] });
					} else if(pHandval < dHandval) {
						await interaction.update({ content: 'Dealer ' + displayHand(dealerHand)+'\n'+'Player '+displayHand(playerHand) + '\n You Lose', components: [buttonRow] });
					} else {
						await interaction.update({ content: 'Dealer ' + displayHand(dealerHand)+'\n'+'Player '+displayHand(playerHand) + '\n Draw!', components: [buttonRow] });
					}
					betphase = true;
				} else if(interaction.customId === 'hit' && !betphase) {
					playerHand.push(generateCard());
					pHandval = calculateHandValue(playerHand);
					if( pHandval > 21) {
						await interaction.update({ content: 'Dealer ' + displayHand(dealerHand)+'\n'+'Player '+displayHand(playerHand) + '\n You went bust!', components: [buttonRow] } );
						betphase = true;
					} else if(pHandval == 21) {
						while(dHandval < 17) {
							dealerHand.push(generateCard());
							await interaction.update({ content: 'Dealer ' + displayHand(dealerHand)+'\n'+'Player '+displayHand(playerHand), components: [buttonRow] });
							sleep(1500);
						}
						if(pHandval > dHandval) {
							await interaction.update({ content: 'Dealer ' + displayHand(dealerHand)+'\n'+'Player '+displayHand(playerHand) + '\n You win 30 marvincoins!', components: [buttonRow] });
						} else if(pHandval < dHandval) {
							await interaction.update({ content: 'Dealer ' + displayHand(dealerHand)+'\n'+'Player '+displayHand(playerHand) + '\n You Lose', components: [buttonRow] });
						} else {
							await interaction.update({ content: 'Dealer ' + displayHand(dealerHand)+'\n'+'Player '+displayHand(playerHand) + '\n Draw!', components: [buttonRow] });
						}
						betphase = true;
					} else {
						await interaction.update({ content: 'Dealer ' + displayHand(dealerHand, true)+'\n'+'Player '+displayHand(playerHand) + '\n Value: '+ pHandval, components: [buttonRow] });
					}
				} else if(interaction.customId === 'hit' && betphase || interaction.customId === 'stand' && betphase){
					interaction.update({ content: 'This round is over' });
				}
				if (interaction.customId === 'end') {
					await interaction.update({ content: 'This game ended' });
					return;
				}
			})
		} catch (err) {
			console.log(err);
		}

	}
})

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
//slash commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	const { commandName } = interaction;

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	if (commandName === 'addtag') {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Tags.create({
				name: tagName,
				description: tagDescription,
				username: interaction.user.username,
			});

			return interaction.reply(`Tag ${tag.name} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That tag already exists.');
			}

			return interaction.reply('Something went wrong with adding a tag.');
		}
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.TOKEN);