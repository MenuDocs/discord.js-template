const utils = require("./utils");
const embed = require("./embeds");

const formEmbed = async (msg, groupObj) => {
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
	let erreurDate = false;
	while (!utils.dateValide(date)) {

		if(erreurDate)
			dateMsg[1].delete().catch(() => console.log("Déjà supprimé"));
        
		dateMsg = await utils.getResponse(
			msg, erreurDate ?
				"Date invalide, réssayez avec le bon format (JJ/MM)" :
				"Quel est la date de remise du devoir ? (JJ/MM)"
		);
		date = dateMsg[0].content;
		dateMsg[0].delete();
		registeredMessages.push(dateMsg[1]);
		erreurDate = true;
	}

	if (!dateMsg){
		utils.tempMsg("Erreur inconnue");
		return;
	}

	registeredMessages.forEach(element => {
		element.delete().catch(() => console.log("Déjà supprimé"));
	});

	let numDevoir = getNewDevoirNum(groupObj);

	return embed.devoirEmbed(
		matiere,
		date,
		intitule,
		msg.author.username,
		numDevoir
	);
};

const getNewDevoirNum = (devoirs) => {
	let numDevoir = 1;
	for (let i = 0; i < devoirs.length; i++) {
		if (numDevoir <= devoirs[i].numéro)
			numDevoir = devoirs[i].numéro + 1;
	}
	return numDevoir;
};

exports.formEmbed = formEmbed;