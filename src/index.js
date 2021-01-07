const Discord = require("discord.js");
const botClient = new Discord.Client();
const config = require("../config.json");

const asciiCats = require("ascii-cats");

const embed = require("./embeds");
const ajout = require("./ajoutDB");
const utils = require("./utils");
const init = require("./initDb");
const suppr = require("./supprDB");
const modif = require("./modifDB");
const compteur = require("./compteur");

let db = require("./devoirs.json");

/**
 * Au démarrage du bot
 */
botClient.on("ready", () => {
	//Status du bot
	botClient.user.setActivity("!help-agenda");

	console.clear();
	console.log("=============================");
	console.log(asciiCats("nyan"));
	console.log("\n\n Bot started !");
	console.log("=============================");
	
});

/**
 * Des qu'un message sur le serveur ou le bot est présent est reçu
 */
botClient.on("message", msg => {
	suppr.supprDevoirDate(db, msg);
	compteur.compteur(db, msg);

	//On regarde si le message commence bien par le prefix (!)
	if (!msg.content.startsWith(config.prefix))//Si le message ne commence pas par le prefix du config.json
		return;

	switch (msg.content.substr(1).split(" ")[0]) {//Switch sur le premier mot du msg sans le prefix Ex: "!agenda dejfez" donne "agenda"
	case "init-agenda":
		init.groupInit(db, msg);
		break;

	case "agenda":
		ajout.ajoutDb(db, msg);
		break;

	case "debug":
		utils.debugDbFile(db, msg);
		break;

	case "clear-db":
		db = utils.clearDbFile(db, msg);
		break;

	case "help-agenda":
		msg.channel.send(embed.helpEmbed());
		break;

	case "suppr-agenda":
		suppr.supprDb(db, msg);
		break;

	case "modif-agenda" :
		modif.modifDB(db, msg);
		break;

	default:
		console.log("Commande non reconnue : " + msg.content);
		break;
	}

	if (msg)
		if (msg.deletable)
			msg.delete()
				.then(() => { console.log("Message supprimé"); })
				.catch(() => { console.error("Message déjà supprimé"); });

});

//Bot login
botClient.login(config.token);