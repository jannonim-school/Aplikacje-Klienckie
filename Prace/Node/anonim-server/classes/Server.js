
const createServer = require('../utilities/Server')
const Endpoint = require('./Endpoint')
const logger = require('../utilities/Logger')

const Route = require('./Route')

module.exports = class Server {

    constructor() {
        this.endpoints = [];
        this.config = {
            jsonParser: false,
            port: process.env.PORT || 3000,
            static: './static'
        };
        /*
            Options for config:
            - jsonParser:bool
            - port:number
            - static:string
        */

        this.server = createServer(this.config, this.endpoints);
        this.root = new Route();
    }

    listen() {
        this.root.route("");
        this.server.listen(this.config.port, () => {
            logger.info(`Server is listening on http://localhost:${this.config.port}`);
        });
    }

    setConfig(key, value) {
        this.config[key] = value;
    }
}