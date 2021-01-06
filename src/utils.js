const embed = require('./embeds')
const fs = require('fs');

/**
 * Retourne la position d'un groupe dans le tableau groups de la db
 * @param id l'id a chercher dans la db (-1 si non trouvé)
 */
const getGroupByID = (groups,id) => {
	for (let i = 0; i < groups.length; i++) {
		if (groups[i].channelId == id)
			return i;
	}
	return -1;
}

const tempMsg = (content, channel) => {
	channel.send(embed.questionEmbed(content)).then(botMsg => {
		botMsg.delete({ timeout: 5000 });
	})
}

const getResponse = async function (msg, question) {

	let questMsg = await msg.channel.send(embed.questionEmbed(question))

	return new Promise(function (resolve) {
		const filter = m => m.author.id === msg.author.id;
		msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
				resolve([collected.first(), questMsg]);
				questMsg.edit(embed.questionEmbed(question, collected.first().content));
			})
			.catch(collected => {
				tempMsg("Annulation...", msg.channel)
				if (questMsg)
					questMsg.delete();
			});
	});
}

/**
 * Met à jour la base donné à partir du la copie "db"
 */
const updateDbFile = (db) => {
	fs.writeFileSync('./src/devoirs.json', JSON.stringify(db));
	console.log("Fichier à jour");
}

exports.getGroupByID = getGroupByID;
exports.tempMsg = tempMsg;
exports.updateDbFile = updateDbFile;
exports.getResponse = getResponse;