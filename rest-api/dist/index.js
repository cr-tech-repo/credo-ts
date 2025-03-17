"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agent_1 = require("./agent");
const tenantRoutes_1 = require("./tenantRoutes");
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Start the application
const start = async () => {
    try {
        // Set up the agent
        const { agent } = await (0, agent_1.setupAgent)();
        // Register routes
        // app.use('/api', createRoutes(agent))
        // app.use('/api/users', createUserRoutes(agent))
        app.use('/api/tenants', (0, tenantRoutes_1.createTenantRoutes)(agent));
        // Start the server
        app.listen(config_1.serverConfig.port, () => {
            console.log(`Server running on port ${config_1.serverConfig.port}`);
            console.log(`Agent initialized with wallet ID: ${agent.config.walletConfig?.id}`);
        });
    }
    catch (error) {
        console.error('Error starting the application:', error);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map