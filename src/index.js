// require the our additons to the Discord.js Client Class.
const MDClient = require('./Structures/MDClient');
// get out token, prefix and owners.
const config = require('../config.json');

// creates a new instance of the Client.
const client = new MDClient(config);
// login to the websocket, load the events and commands.
client.start();
