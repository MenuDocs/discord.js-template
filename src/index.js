const Discord = require('discord.js');
const botClient = new Discord.Client();
const config = require('../config.json');
const canvas = require('canvas');

let db = require('./devoirs.json');
const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');

function devoirEmbed() {
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

function helpEmbed() {
	const exampleEmbed = new Discord.MessageEmbed().setTitle('Aide BotAgenda')
		.addFields(
			{ name: 'Initialiser agenda :', value: '!init-agenda' },
			{ name: 'Ajouter un devoir :', value: '!agenda' },
			{ name: 'Supprimer un devoir :', value: '!suppr-agenda numéro_du_devoir' },
			{ name: 'Modifier un devoir :', value: '!modif-agenda numéro_du_devoir' },
		)
		.setColor('#FFFF00')
		.setImage('https://www.u-bordeaux.fr/var/ezdemo_site/storage/images/media/site-institutionnel/images/images-blandine-test/banniere-idv-gif-anime/16065-1-fre-FR/Banniere-idv-gif-anime_Grande.gif')
	return exampleEmbed;
}

function tempMsg(content, channel) {
	channel.send(content).then(botMsg => {
		botMsg.delete({ timeout: 5000 });
	})
}

botClient.on('ready', () => {
	console.log("Bot is ready");
	botClient.user.setActivity("!help-agenda");
});

botClient.on('message', msg => {

	if (!msg.content.startsWith(config.prefix))//Si le message ne commence pas par le prefix du config.json
		return;

	switch (msg.content.substr(1).split(" ")[0]) {

		case 'init-agenda':
			groupInit(msg);
			break;

		case 'agenda':
			ajoutDb(msg);
			break;

		case 'debug':
			msg.reply(JSON.stringify(db));
			break;

		case 'clear-db':
			db = { "groups": [] };
			updateDbFile(db);
			tempMsg("Fichier nettoyé")
			break;

		case 'help-agenda':
			msg.channel.send(helpEmbed());
			break;

		default:
			console.log("commande non reconnue");
			break;
	}

	msg.delete({ timeout: 5000 });

});

botClient.login(config.token);

// class Devoir {
// 	// constructor(matiere, date, titre){
// 	// 	this.matiere = matiere;
// 	// 	this.date = date;
// 	// 	this.titre = titre;
// 	// }
// 	constructor(msg){

// 	}
// }

/**
 * Ajoute un devoir dans la base de donnée
 */
async function ajoutDb(msg) {

	const id = msg.channel.id;

	if (getGroupByID(id) == -1) {
		console.error("Cet id n'existe pas");
		tempMsg("Ce salon n'est pas un agenda (!help-agenda)", msg.channel)
		return;
	}

	
	const titreMsg = await getResponse(msg, "Dans quelle matière souhaitez vous ajouter ce devoir ?");
	const titre = titreMsg.first().content;

	const intituléMsg = await getResponse(msg, "Quel est l'intitulé du devoir ?");
	const intitulé = intituléMsg.first().content;
	
	const dateMsg = await getResponse(msg, "Quel est la date de remise du devoir ? (JJMM)");
	const date = dateMsg.first().content;
	
	
	dateMsg.first().reply("Enregistrement de :\n titre : " + titre + "\n intitulé : " + intitulé + "\n date : " + date);

	console.log("execution done")
}

const getResponse = function (msg, question) {
	msg.channel.send(question);

	return new Promise(function (resolve) {
		const filter = m => m.author.id === msg.author.id;
		msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
			resolve(collected)
		})
		.catch(collected => {
			tempMsg("Annulation...", msg.channel)
		});
	});
}


async function demander(msg) {
	msg.channel.send("Quel titre ?").then(() => {
		msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
				msg.channel.send(`${collected.first().author} tes un bg`);
			})
			.catch(collected => {
				tempMsg("Annulation...", msg.channel)
			});
	});
}

function groupInit(msg) {
	try {
		const id = msg.channel.id;
		const channelName = msg.channel.name;

		let groupFound = false;
		db.groups.forEach(group => {
			if (group.channelId === id) {
				console.log("duplicate found");
				groupFound = true;
				return;
			}
		});

		if (groupFound) {
			tempMsg("Ce salon est déjà initialisé.", msg.channel);
			return;
		}

		db.groups.push({
			"channelId": id,
			"name": channelName,
			"devoirs": []
		})

		updateDbFile();
		console.log("Groupe ajouté : " + channelName);

		tempMsg(`Ce salon est désormais l'agenda : ${channelName}`, msg.channel);
	} catch (e) {
		console.error(e);
	}
}

/**
 * Retourne la position d'un groupe dans le tableau groups de la db
 * @param id l'id a chercher dans la db (-1 si non trouvé)
 */
function getGroupByID(id) {
	for (let i = 0; i < db.groups.length; i++) {
		if (db.groups[i].channelId == id)
			return i;
	}
	return -1;
}

/**
 * Met à jour la base donné à partir du la copie "db"
 */
function updateDbFile(custom = null) {
	fs.writeFileSync('./src/devoirs.json', JSON.stringify(custom == null ? db : custom));
	console.log("fichier à jour");
}