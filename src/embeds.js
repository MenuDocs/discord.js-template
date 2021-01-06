const Discord = require('discord.js');

const devoirEmbed = (matiere, date, intitule, auteur, numDevoir) => {
	const exampleEmbed = new Discord.MessageEmbed().setTitle(matiere)
		.setAuthor(auteur)
		.addFields(
			{ name: 'Date de remise :', value: date },
			{ name: 'Devoirs :', value: intitule },
		)
		.setColor('#FFFF00')
		.setFooter(numDevoir)
		.setTimestamp()
	return exampleEmbed;
}

const helpEmbed = () => {
	const exampleEmbed = new Discord.MessageEmbed().setTitle('Aide BotAgenda')
		.addFields(
			{ name: 'Initialiser agenda :', value: '!init-agenda' },
			{ name: 'Ajouter un devoir :', value: '!agenda' },
			{ name: 'Supprimer un devoir :', value: '!suppr-agenda' },
			{ name: 'Modifier un devoir :', value: '!modif-agenda numéro_du_devoir' },
		)
		.setColor('#FFFF00')
		.setImage('https://www.u-bordeaux.fr/var/ezdemo_site/storage/images/media/site-institutionnel/images/images-blandine-test/banniere-idv-gif-anime/16065-1-fre-FR/Banniere-idv-gif-anime_Grande.gif')
	return exampleEmbed;
}

const questionEmbed = (question, footer = null) => {
	const exampleEmbed = new Discord.MessageEmbed().setTitle(question)
		.setColor('#133e47');
	
	if(footer != null)
		exampleEmbed.setFooter(footer)
	return exampleEmbed;
}

exports.devoirEmbed = devoirEmbed;
exports.helpEmbed = helpEmbed;
exports.questionEmbed = questionEmbed;

// module.exports = {
//     creerEmbed,
//     helpEmbed,
//     questionEmbed,
// };