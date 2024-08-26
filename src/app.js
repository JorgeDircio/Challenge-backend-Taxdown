const Server = require('./infrastructure/server/Server');

const server = new Server();
module.exports.app = server.getHandler();
