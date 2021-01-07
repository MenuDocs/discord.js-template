const utils = require('./utils')
const embed = require('./embeds');

/**
 * Ajoute un devoir dans la base de donnée
 * @param db le contenu de la base de donnée
 * @param msg le message d'origine
 */
const ajoutDb = async (db, msg) => {
	console.log("Demande d'ajout")

	const id = msg.channel.id;

	const groupID = utils.getGroupByID(db.groups, id);

	if (groupID == -1) {
		console.error("Cet id n'existe pas");
		utils.tempMsg("Ce salon n'est pas un agenda (!help-agenda)", msg.channel)
		return;
	}

	let registeredMessages = [];

	const matiereMsg = await utils.getResponse(msg, "Dans quelle matière souhaitez vous ajouter ce devoir ?");
	const matiere = utils.trouverMatière(matiereMsg[0].content);
	matiereMsg[0].delete();
	registeredMessages.push(matiereMsg[1]);

	const intituleMsg = await utils.getResponse(msg, "Quel est l'intitulé du devoir ?");
	const intitule = intituleMsg[0].content;
	intituleMsg[0].delete();
	registeredMessages.push(intituleMsg[1]);

	let date = "_";
	let dateMsg = null;
	while (!utils.dateValide(date)) {
		dateMsg = await utils.getResponse(msg, "Quel est la date de remise du devoir ? (JJ/MM)");
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
	for (let i = 0; i < db.groups[groupID].devoirs.length; i++) {
		if (numDevoir <= db.groups[groupID].devoirs[i].numéro)
			numDevoir = db.groups[groupID].devoirs[i].numéro + 1;
	}

	const devoirMsg = await dateMsg[0].reply(embed.devoirEmbed(
		matiere,
		date,
		intitule,
		msg.author.username,
		numDevoir
	));

	embedID = devoirMsg.id;

	db.groups[groupID].devoirs.push({
		"embedId": embedID,
		"numéro": numDevoir,
		"matière": matiere,
		"date": date,
		"intitulé": intitule,
	})

	utils.updateDbFile(db);
}



exports.ajoutDb = ajoutDb;