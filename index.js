const fs = require('fs');
const path = require('path')
const { Client, Events, GatewayIntentBits, Collection, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
require('dotenv').config();
const { getXMedia, sendXMedia } = require('./socialMediaGrabbers/x.js');
const { getTokMedia, sendTokMedia } = require('./socialMediaGrabbers/tt.js');
const { getIGMedia, sendIGMedia } = require('./socialMediaGrabbers/insta.js');
const Queue = require('./socialMediaGrabbers/Queue.js');
const queue = new Queue();


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


client.on('messageCreate', async msg => {
	if(msg.author.bot) return;
	
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

		const reply = await msg.reply({ content: 'X \t X \t X\nX \t X \t X\nX \t X \t X\n', components: [buttonRow] });

		const filter = (i) => i.user.id === msg.author.id;

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter,
		});
		
		const slotsArr = [':smiling_imp:', ':skull:', ':eggplant:'];
		 
		collector.on('collect', (interaction) => {
			let randArr = ['', '', '', '', '', '', '', '', '',];
			for(let i=0; i<9; i++) {
				let rand = randNum(1, 10);
				if(rand <= 2)
					randArr[i] = slotsArr[2];
				else if(rand < 7)
					randArr[i] = slotsArr[1];
				else
					randArr[i] = slotsArr[0];
			}
			if (interaction.customId === 'spin') {
				if()
				interaction.update({ content: `| ${randArr[0]} | ${randArr[1]} | ${randArr[2]}| 
											 \n| ${randArr[3]} | ${randArr[4]} | ${randArr[5]}| 
											 \n| ${randArr[6]} | ${randArr[7]} | ${randArr[8]}|\n`, components: [buttonRow] });
				return;
			}

			if (interaction.customId === 'quit') {
				interaction.update({ content: 'X \t X \t X\nX \t X \t X\nX \t X \t X\n', components: [buttonRow] });
				return;
			}
		})

		} catch(err) {
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