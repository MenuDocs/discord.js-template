const utils = require("./utils");

/**
 * Initialise la db dans le channel
 * @param db le contenu du fichier a mettre a jour
 * @param msg le message d'origine
 */
const groupInit = (db,msg) => {
	try {
		const id = msg.channel.id;
		const channelName = msg.channel.name;

		let groupFound = false;
		db.groups.forEach(group => {
			// Si la db a deja été initialisée dans ce channel
			if (group.channelId === id) {
				console.log("duplicate found");
				groupFound = true;
				return;
			}
		});

		// Si la db a deja été initialisée dans ce channel
		if (groupFound) {
			utils.tempMsg("Ce salon est déjà initialisé.", msg.channel);
			return;
		}

		db.groups.push({
			"channelId": id,
			"name": channelName,
			"devoirs": []
		});

		utils.updateDbFile(db);
		console.log("Groupe ajouté : " + channelName);

		utils.tempMsg(`Ce salon est désormais l'agenda : ${channelName}`, msg.channel);
	} catch (e) {
		console.error(e);
	}
};

exports.groupInit = groupInit;