const utils = require('./utils')
const embed = require('./embeds');

/**
 * Supprime un devoir de la db
 * @param db le contenu du fichier a mettre a jour
 * @param msg le message d'origine
 */
const supprDb = async (db,msg) => {
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
				})

			db.groups[groupID].devoirs.splice(i, 1);
			utils.tempMsg(`Devoir ${suppr} supprimé !`, msg.channel);
			return;
		}
	}

	utils.tempMsg("Aucun devoir avec ce numéro dans l'agenda", msg.channel);
}

/**
 * Supprime un devoir (et l'embed correspondant) si la date est passée
 * @param db le contenu du fichier a mettre a jour 
 * @param msg le message originel
 */
const supprDevoirDate = async (db,msg) => {
	const today = new Date();
	let day = today.getDate().toString();
	let month = (today.getMonth() + 1).toString();
	const zero = '0';

	if (day.length == 1) {
		day = zero + day;
	}

	if (month.length == 1) {
		month = zero + month;
	}
	
	let dateDevoir = null;
	for(let g = 0 ; g < db.groups.length; g++){
		for (let i = 0; i < db.groups[g].devoirs.length; i++) {
			dateDevoir = db.groups[g].devoirs[i].date;
			splitArr = dateDevoir.split("/");
			dayDevoir = +splitArr[0];
			monthDevoir = +splitArr[1];
	
			if (monthDevoir === ('01') || ('03') || ('05') || ('07') || ('08') || ('10') || ('12')){
				if (day === (dayDevoir + 1) || month === (monthDevoir + 1) || ((day === '01' && dayDevoir === '31') && (month === '01' && monthDevoir === '12'))){
					db.groups[g].devoirs.splice(i, 1);
					msg.channel.messages.fetch(db.groups[g].devoirs[i].embedId)
					.then(embed => {
						embed.delete();
					}).catch(e => {
						console.error(e);
					})
				}
			}
			else if (monthDevoir === '02') {
				if (day === (dayDevoir + 1) || month === (monthDevoir + 1)) {
					db.groups[g].devoirs.splice(i, 1);
					msg.channel.messages.fetch(db.groups[g].devoirs[i].embedId)
					.then(embed => {
						embed.delete();
					}).catch(e => {
						console.error(e);
					})
				}
			}
			else{
				if (day === (dayDevoir + 1) || month === (monthDevoir + 1)) {
					db.groups[g].devoirs.splice(i, 1);
					msg.channel.messages.fetch(db.groups[g].devoirs[i].embedId)
					.then(embed => {
						embed.delete();
					}).catch(e => {
						console.error(e);
					})
				}
			}	
		}
	}


}

exports.supprDb = supprDb;
exports.supprDevoirDate = supprDevoirDate;
