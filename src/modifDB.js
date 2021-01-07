
const utils = require('./utils')
const embed = require('./embeds');


/**
 * Modifie la db et l'embed correspondant au devoir
 * @param db le contenu de la db
 * @param msg le message originel
 */
const modifDb = async (db,msg) => {
	console.log("Demande de modif")

    const id = msg.channel.id;

	const groupID = utils.getGroupByID(db.groups,id);

	// Si l'agenda n'a pas été initialisé
	if (groupID == -1) {
		console.error("Cet id n'existe pas");
		utils.tempMsg("Ce salon n'est pas un agenda (!help-agenda)", msg.channel)
		return;
	}

	// Si aucun devoir n'a été ajouté
	if (Object.keys(db.groups[groupID].devoirs).length == 0) {
		utils.tempMsg("Aucun devoir dans l'agenda", msg.channel)
		return;
    }
    
    const modifMsg = await utils.getResponse(msg, "Quel devoir voulez-vous modifier ? (numéro du devoir)");
    let modif = modifMsg[0].content;
	modifMsg[0].delete();
    modifMsg[1].delete();
	

	if (groupID == -1) {
		console.error("Cet id n'existe pas");
		utils.tempMsg("Ce salon n'est pas un agenda (!help-agenda)", msg.channel)
		return;
	}

	let registeredMessages = [];

	const matiereMsg = await utils.getResponse(msg, "Dans quelle matière souhaitez vous ajouter ce devoir ?");
	const matiere = matiereMsg[0].content;
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

	nvEmbed = embed.devoirEmbed(
		matiere,
		date,
		intitule,
		msg.author.username,
		modif
	);

	utils.updateDbFile(db);

    for (let i = 0; i < db.groups[groupID].devoirs.length; i++) {
		if (db.groups[groupID].devoirs[i].numéro == modif) {

			const embedID = db.groups[groupID].devoirs[i].embedId;

			msg.channel.messages.fetch(embedID)
				.then(embed => {
					embed.edit(nvEmbed);
				}).catch(e => {
					console.error(e);
				})
            
            // Suppression du devoir a modifier dans la bd
			db.groups[groupID].devoirs.splice(i, 1);  
            
            // Rajout du nouveau devoir dans la bd
			db.groups[groupID].devoirs.push({
				"embedId": embedID,
				"numéro": parseInt(modif),
				"matière": matiere,
				"date": date,
				"intitulé": intitule,
			})

			utils.tempMsg(`Devoir ${modif} modifié !`, msg.channel);
			return;
		}
    }
    

}

exports.modifDB = modifDb;