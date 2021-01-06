const Discord = require('discord.js');
const botClient = new Discord.Client();
const config = require('../config.json');
const asciiCats = require('ascii-cats')

let db = require('./devoirs.json');

const embed = require('./embeds');
const ajout = require('./ajoutDB')
const utils = require('./utils')
const init = require('./initDb')
const suppr = require('./supprDB')

botClient.on('ready', () => {
	botClient.user.setActivity("!help-agenda");
	console.clear();

	console.log("=============================")
	console.log(asciiCats('nyan'));
	console.log("\n\n Bot started !")
	console.log("=============================")
});

botClient.on('message', msg => {

	if (!msg.content.startsWith(config.prefix))//Si le message ne commence pas par le prefix du config.json
		return;

	switch (msg.content.substr(1).split(" ")[0]) {

		case 'init-agenda':
			init.groupInit(db, msg);
			break;

		case 'agenda':
			ajout.ajoutDb(db, msg);
			break;

		case 'debug':
			msg.reply("```" + JSON.stringify(db, null, 4) + "```")
			msg.delete();
			break;

		case 'clear-db':
			msg.delete();
			db = { "groups": [] };
			utils.updateDbFile(db);
			console.warn("DATABASE RESET");
			break;

		case 'help-agenda':
			msg.channel.send(embed.helpEmbed());
			break;

		case 'suppr-agenda':
			suppr.supprDb(db, msg);
			break;

		default:
			console.log("commande non reconnue");
			break;
	}

	try {
		msg.delete()
	}
	catch {
		(e) => {
			console.error(e);
		}
	}

});

botClient.login(config.token);