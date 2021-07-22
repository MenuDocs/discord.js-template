const Command = require('../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pong'],
			description: 'This provides the ping of the bot',
			category: 'Utilities'
		});
	}

	async run(message) {
		const msg = await message.reply('Pinging...');
		const latency = msg.createdTimestamp - message.createdTimestamp;

		msg.edit({
			content: `Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(this.client.ws.ping)}ms\``
		});
	}

};
