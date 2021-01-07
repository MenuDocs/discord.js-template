const utils = require("./utils");
const formEmbedCreator = require("./formEmbedCreator");

/**
 * Modifie la db et l'embed correspondant au devoir
 * @param db le contenu de la db
 * @param msg le message originel
 */
const modifDb = async (db, msg) => {

	console.log("Demande de modif");

	const id = msg.channel.id;
	const groupID = utils.getGroupByID(db.groups, id);
	if (groupID == -1) {
		console.error("Cet id n'existe pas");
		utils.tempMsg("Ce salon n'est pas un agenda (!help-agenda)", msg.channel);
		return;
	}

	// Si aucun devoir n'a été ajouté
	if (Object.keys(db.groups[groupID].devoirs).length == 0) {
		utils.tempMsg("Aucun devoir dans l'agenda", msg.channel);
		return;
	}

	const modifMsg = await utils.getResponse(msg, "Quel devoir voulez-vous modifier ? (numéro du devoir)");
	let numeroValide = false;
	let modif = modifMsg[0].content;

	db.groups[groupID].devoirs.forEach(element => {
		if(element.numéro == modif)
			numeroValide = true;
	});
	
	modifMsg[0].delete();
	modifMsg[1].delete();

	if(!numeroValide){
		utils.tempMsg("Ce numéro de devoir n'existe pas", msg.channel, 2000);
		return;
	}


	let finalEmbed = await formEmbedCreator.formEmbed(msg, db.groups[groupID]);

	for (let i = 0; i < db.groups[groupID].devoirs.length; i++) {
		if (db.groups[groupID].devoirs[i].numéro == modif) {

			const embedID = db.groups[groupID].devoirs[i].embedId;

			msg.channel.messages.fetch(embedID)
				.then(embed => {
					embed.edit(finalEmbed);
				}).catch(e => {
					console.error(e);
				});

			// Suppression du devoir a modifier dans la bd
			db.groups[groupID].devoirs.splice(i, 1);

			// Rajout du nouveau devoir dans la bd
			db.groups[groupID].devoirs.push({
				"embedId": embedID,
				"matière": finalEmbed.title,
				"numéro": parseInt(finalEmbed.footer.text),
				"date": finalEmbed.fields[0].value,
				"intitulé": finalEmbed.fields[1].value,
			});

			utils.tempMsg(`Devoir ${modif} modifié !`, msg.channel, 2);
			return;
		}
	}

	utils.updateDbFile(db);
};

exports.modifDB = modifDb;