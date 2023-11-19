const fs = require('fs');
const path = require('path')
const { Client, Events, GatewayIntentBits, Collection, MessageAttachment } = require('discord.js');
require('dotenv').config();
const dbmethods = require('./editDB');
const Econ = require('./models/econ');
const { getXMedia, sendXMedia, deleteMedia } = require('./socialMediaGrabbers/x.js');
const { match } = require('assert');

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

client.on('guildMemberAdd', member => {
	
	dbmethods.add(member.user.id, Econ, member.user.username);
});

client.on('messageCreate', async msg => {
	const urlRegex = /(https?:\/\/[^\s]+)/gi;
	const messageContent = msg.content;
	const matchedLinks = messageContent.match(urlRegex);
	
	try {
		for(let i=0;i<matchedLinks.length;i++) {
			if(matchedLinks[i].startsWith('https://twitter.com') || matchedLinks[i].startsWith('https://x.com')) {
				getXMedia(matchedLinks[i]);
				await new Promise(r => setTimeout(r, 6250));
				const flpth = await sendXMedia();
				await msg.channel.send({
					content:
						``,
					files: [flpth]
				}).catch((err) => {
					 console.log("Error during Export File " + err);
				});
				
				deleteMedia();
				await new Promise(r => setTimeout(r, 10000));
			}
		}
		msg.delete();
		
	} catch (err) {
        
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