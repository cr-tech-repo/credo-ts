"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAgent = void 0;
const core_1 = require("@credo-ts/core");
const didcomm_1 = require("@credo-ts/didcomm");
const askar_shared_1 = require("@openwallet-foundation/askar-shared");
const askar_nodejs_1 = require("@openwallet-foundation/askar-nodejs");
const node_1 = require("@credo-ts/node");
const config_1 = require("./config");
const CustomAskarModule_1 = require("./modules/CustomAskarModule");
const setupAgent = async () => {
    // Register Askar
    (0, askar_shared_1.registerAskar)({ askar: askar_nodejs_1.askar });
    // Create agent with custom Askar module and default DIDComm modules
    const agent = new core_1.Agent({
        config: config_1.agentConfig,
        dependencies: node_1.agentDependencies,
        modules: {
            askar: new CustomAskarModule_1.CustomAskarModule(),
            ...(0, didcomm_1.getDefaultDidcommModules)({
                didCommMimeType: 'application/didcomm-envelope-enc',
            }),
        },
    });
    // Initialize agent
    await agent.initialize();
    return {
        agent,
    };
};
exports.setupAgent = setupAgent;
//# sourceMappingURL=agent.js.map