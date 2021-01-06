const utils = require('./utils')
const embed = require('./embeds');

const supprDb = async (db,msg) => {
	const id = msg.channel.id;

	const groupID = utils.getGroupByID(db.groups,id);

	if (groupID == -1) {
		console.error("Cet id n'existe pas");
		utils.tempMsg("Ce salon n'est pas un agenda (!help-agenda)", msg.channel)
		return;
	}

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

			const msgIndex = i;
			db.groups[groupID].devoirs.splice(msgIndex, 1);
			utils.tempMsg(`Devoir ${suppr} supprimé !`, msg.channel);
			return;
		}
	}

	utils.tempMsg("Aucun devoir avec ce numéro dans l'agenda", msg.channel);
}

exports.supprDb = supprDb;
