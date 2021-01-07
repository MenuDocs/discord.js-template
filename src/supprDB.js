const utils = require("./utils");

/**
 * Supprime un devoir de la db
 * @param db le contenu du fichier a mettre a jour
 * @param msg le message d'origine
 */
const supprDb = async (db, msg) => {
	const id = msg.channel.id;

	const groupID = utils.getGroupByID(db.groups, id);

	// Si l'agenda n'a pas été initialisé
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

	const supprMsg = await utils.getResponse(msg, "Quel devoir voulez-vous supprimer ? (numéro du devoir)");
	let suppr = supprMsg[0].content;
	supprMsg[0].delete();
	supprMsg[1].delete();

	for (let i = 0; i < db.groups[groupID].devoirs.length; i++) {
		if (db.groups[groupID].devoirs[i].numéro == suppr) {

			msg.channel.messages.fetch(db.groups[groupID].devoirs[i].embedId)
				.then(embed => {
					embed.delete();
				}).catch(e => {
					console.error(e);
				});

			db.groups[groupID].devoirs.splice(i, 1);
			utils.tempMsg(`Devoir ${suppr} supprimé !`, msg.channel);
			return;
		}
	}

	utils.tempMsg("Aucun devoir avec ce numéro dans l'agenda", msg.channel);
};

/**
 * Supprime un devoir (et l'embed correspondant) si la date est passée
 * @param db le contenu du fichier a mettre a jour 
 * @param msg le message originel
 */
const supprDevoirDate = async (db, msg) => {
	const today = new Date();
	let day = today.getDate();
	let month = (today.getMonth() + 1);

	let dateDevoir = null;
	for (let g = 0; g < db.groups.length; g++) {
		for (let i = 0; i < db.groups[g].devoirs.length; i++) {
			dateDevoir = db.groups[g].devoirs[i].date;
			let splitArr = dateDevoir.split("/");
			let dayDevoir = parseInt(splitArr[0]);
			let monthDevoir = parseInt(splitArr[1]);
			if (monthDevoir === 1 || monthDevoir === 3 || monthDevoir === 5 || monthDevoir === 7 || monthDevoir === 8 || monthDevoir === 10 || monthDevoir === 12) {
				if (day === (dayDevoir + 1) || month === (monthDevoir + 1) || ((day === 1 && dayDevoir === 31) && (month === 1 && monthDevoir === 12))) {
					msg.channel.messages.fetch(db.groups[g].devoirs[i].embedId)
						.then(embed => {
							embed.delete();
						}).catch(e => {
							console.error(e);
						});
					db.groups[g].devoirs.splice(i, 1);
				}
			}
			else if (monthDevoir === 2) {
				if (day === (dayDevoir + 1) || month === (monthDevoir + 1)) {
					msg.channel.messages.fetch(db.groups[g].devoirs[i].embedId)
						.then(embed => {
							embed.delete();
						}).catch(e => {
							console.error(e);
						});
					db.groups[g].devoirs.splice(i, 1);
				}
			}
			else {
				if (day === (dayDevoir + 1) || month === (monthDevoir + 1)) {
					msg.channel.messages.fetch(db.groups[g].devoirs[i].embedId)
						.then(embed => {
							embed.delete();
						}).catch(e => {
							console.error(e);
						});
					db.groups[g].devoirs.splice(i, 1);
				}
			}
		}
	}


};

exports.supprDb = supprDb;
exports.supprDevoirDate = supprDevoirDate;