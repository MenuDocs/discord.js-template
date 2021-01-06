const Discord = require('discord.js');
const botClient = new Discord.Client();
const config = require('../config.json');
const canvas = require('canvas');

let db = require('./devoirs.json');
const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');


function creerEmbed(matiere, date, intitule, auteur, numDevoir) {
	const exampleEmbed = new Discord.MessageEmbed().setTitle(matiere)
		.setAuthor(auteur)
		.addFields(
			{ name: 'Date de remise :', value: date },
			{ name: 'Devoirs :', value: intitule },
		)
		.setColor('#FFFF00')
		.setFooter(numDevoir)
		.setTimestamp()
	return exampleEmbed;
}

function helpEmbed() {
	const exampleEmbed = new Discord.MessageEmbed().setTitle('Aide BotAgenda')
		.addFields(
			{ name: 'Initialiser agenda :', value: '!init-agenda' },
			{ name: 'Ajouter un devoir :', value: '!agenda' },
			{ name: 'Supprimer un devoir :', value: '!suppr-agenda' },
			{ name: 'Modifier un devoir :', value: '!modif-agenda numéro_du_devoir' },
		)
		.setColor('#FFFF00')
		.setImage('https://www.u-bordeaux.fr/var/ezdemo_site/storage/images/media/site-institutionnel/images/images-blandine-test/banniere-idv-gif-anime/16065-1-fre-FR/Banniere-idv-gif-anime_Grande.gif')
	return exampleEmbed;
}

function questionEmbed(question, footer = null) {
	const exampleEmbed = new Discord.MessageEmbed().setTitle(question)
		.setColor('#133e47');
	
	if(footer != null)
		exampleEmbed.setFooter(footer)
	return exampleEmbed;
}

function tempMsg(content, channel) {
	channel.send(questionEmbed(content)).then(botMsg => {
		botMsg.delete({ timeout: 5000 });
	})
}

botClient.on('ready', () => {
	console.clear();
	console.log("Bot is ready");
	botClient.user.setActivity("!help-agenda");
});


botClient.login(config.token);

/**
 * Ajoute un devoir dans la base de donnée
 */
async function ajoutDb(msg) {
	console.log("Demande d'ajout")
	const id = msg.channel.id;
	
	const groupID = getGroupByID(id);
	
	if (groupID == -1) {
		console.error("Cet id n'existe pas");
		tempMsg("Ce salon n'est pas un agenda (!help-agenda)", msg.channel)
		return;
	}
	
	let registeredMessages = [];

	const matiereMsg = await getResponse(msg, "Dans quelle matière souhaitez vous ajouter ce devoir ?");
	const matiere = matiereMsg[0].content;
	matiereMsg[0].delete();
	registeredMessages.push(matiereMsg[1]);

	const intituleMsg = await getResponse(msg, "Quel est l'intitulé du devoir ?");
	const intitule = intituleMsg[0].content;
	intituleMsg[0].delete();
	registeredMessages.push(intituleMsg[1]);
	
	let date = "_";
	let dateMsg = null;
	while (!dateValide(date)) {
		dateMsg = await getResponse(msg, "Quel est la date de remise du devoir ? (JJ/MM)");
		date = dateMsg[0].content;
		dateMsg[0].delete();
		registeredMessages.push(dateMsg[1]);
	}

	if (!dateMsg)
		throw new error;

	registeredMessages.forEach(element => {
		element.delete();
	});

	let numDevoir = 1;
	for (let i = 0; i < db.groups[groupID].devoirs.length; i++){
		if(numDevoir <= db.groups[groupID].devoirs[i].numéro)
			numDevoir = db.groups[groupID].devoirs[i].numéro + 1;
	} 

	const devoirMsg = await dateMsg[0].reply(creerEmbed(
		matiere,
		date,
		intitule,
		msg.author.username,
		numDevoir
	));

	embedID = devoirMsg.id;	
	
	db.groups[groupID].devoirs.push({
		"embedId" : embedID,
		"numéro": numDevoir,
		"matière": matiere,
		"date": date,
		"intitulé": intitule,
	})

	updateDbFile();
}

function dateValide(date) {
	if (date.length !== 5)
		return false;

	splitArr = date.split("/");
	if (splitArr.length !== 2)
		return false

	if (+splitArr[0] !== parseInt(splitArr[0]))
		return false

	if (+splitArr[1] !== parseInt(splitArr[1]))
		return false

	if (parseInt(splitArr[0]) > 31 || parseInt(splitArr[0]) <= 0)
		return false;

	if (parseInt(splitArr[1]) > 12 || parseInt(splitArr[1]) <= 0)
		return false;

	return true;
}

const getResponse = async function (msg, question) {
	
	let questMsg = await msg.channel.send(questionEmbed(question))
	
	return new Promise(function (resolve) {
		const filter = m => m.author.id === msg.author.id;
		msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
			resolve([collected.first() , questMsg]);
			questMsg.edit(questionEmbed(question, collected.first().content));
		})
		.catch(collected => {
			tempMsg("Annulation...", msg.channel)
			if(questMsg)
				questMsg.delete();
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

async function supprDb(msg) {
	const id = msg.channel.id;

	const groupID = getGroupByID(id);

	if (groupID == -1) {
		console.error("Cet id n'existe pas");
		tempMsg("Ce salon n'est pas un agenda (!help-agenda)", msg.channel)
		return;
	}

	if (Object.keys(db.groups[groupID].devoirs).length == 0){
		tempMsg("Aucun devoir dans l'agenda", msg.channel)
		return;
	}

	const supprMsg = await getResponse(msg, "Quel devoir voulez-vous supprimer ? (numéro du devoir)");
	let suppr = supprMsg[0].content;
	supprMsg[0].delete();
	supprMsg[1].delete();

	for (let i = 0; i < db.groups[groupID].devoirs.length; i++) {
		if(db.groups[groupID].devoirs[i].numéro == suppr){

			msg.channel.messages.fetch(db.groups[groupID].devoirs[i].embedId)
			.then(embed => {
				embed.delete();
			}).catch(e => {
				console.error(e);
			})
			
			const msgIndex = i;
			db.groups[groupID].devoirs.splice(msgIndex,1);
			tempMsg(`Devoir ${suppr} supprimé !`, msg.channel);
			return;
		}
	}

	tempMsg("Aucun devoir avec ce numéro dans l'agenda", msg.channel);
}

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
			msg.reply("```" + JSON.stringify(db,null,4) + "```");
			break;

		case 'clear-db':
			db = { "groups": [] };
			updateDbFile(db);
			tempMsg("Fichier nettoyé")
			break;

		case 'help-agenda':
			msg.channel.send(helpEmbed());
			break;


		case 'suppr-agenda':
			supprDb(msg);
			break;

		default:
			console.log("commande non reconnue");
			break;
	}

	msg.delete({ timeout: 5000 });

});