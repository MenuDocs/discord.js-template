const Discord = require('discord.js');
const botClient = new Discord.Client();
const config = require('../config.json');

const DATABASE = require('./devoirs.json');
																			const dbContent = require('./devoirs.json');

function envoyerEmbed () {
	const exampleEmbed = new Discord.MessageEmbed().setTitle('A faire')
	exampleEmbed.addFields(
		{ name: 'Date', value: '8 Janvier' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Matière', value: 'Algo-Prog', inline: true },
		{ name: 'Devoirs', value: 'TP Recursivité', inline: true },
	);
	exampleEmbed.setColor('#FFFF00')
	return exampleEmbed;
}

function groupInit(msg) {
	// trouver l'id du salon
	const id = msg.channel.id;
	
	// recuperrer le nom du salon
	const channelName = msg.channel.name;
	
	// ecrire dans la bd -> creer nv groupe
	console.log(id);
	console.log(channelName);
}

console.log("Startup")

botClient.on('ready', () => {
	console.log(dbContent);
});

botClient.on('message', msg => {
	if ( ! msg.content.startsWith(config.prefix)){//Si le message ne commence pas par le prefix du config.json
		return;
	}

	const content = msg.content.substr(1);//supr premier char
	
	if (content == 'init-agenda') {
		groupInit(msg);
		msg.channel.send('Agenda initialisé');
	}
	
	if (content == 'Agenda') {
		msg.channel.send('Vos devoirs sont :');
	}

	if (content == 'Location') {
		msg.channel.send(msg.channel.guild.region);
	}

	if (content == 'Embed') {
		msg.channel.send(envoyerEmbed());
	}
});

botClient.login(config.token);