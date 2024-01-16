const fs = require('fs');
const path = require('path')
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const dbmethods = require('./editDB');
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
    ]
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

const handleMedia = async (Q, msg) => {
	//for(let i=0;i<Q.size();i++) {
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
	//}
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
	const urlRegex = /(https?:\/\/[^\s]+)/gi;
	const messageContent = msg.content;
	const matchedLinks = messageContent.match(urlRegex);
	try {
		if(matchedLinks != null) {
			for(let i=0;i<matchedLinks.length;i++){
				queue.enqueue(matchedLinks[i]);
			}
			handleMedia(queue, msg);
		}
	} catch (err) {
		console.log(err);
	}
})

client.on('guildMemberRemove', member => {
	dbmethods.remove(member.user.id, Econ);
});

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