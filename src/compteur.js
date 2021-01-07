

const compteur = async (db) => {
	let today = new Date();
	for (let g = 0; g < db.groups.length; g++) {
		for (let i = 0; i < db.groups[g].devoirs.length; i++) {
			let dateDevoir = db.groups[g].devoirs[i].date;
			const splitArr = dateDevoir.split("/");
			const dayDevoir = parseInt(splitArr[0]);
			const monthDevoir = parseInt(splitArr[1]);
			dateDevoir = new Date(2021,monthDevoir -1 ,dayDevoir + 1);
			// console.log(dateDevoir);
			// console.log(datediff(today, dateDevoir));
		}
	}
};

function datediff(first, second) {
	// Take the difference between the dates and divide by milliseconds per day.
	// Round to nearest whole number to deal with DST.
	return Math.round((second-first)/(1000*60*60*24));
}


exports.compteur = compteur;