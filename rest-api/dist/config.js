"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = exports.agentConfig = exports.askarPostgresStorageConfig = void 0;
const core_1 = require("@credo-ts/core");
// PostgreSQL configuration for Askar
exports.askarPostgresStorageConfig = {
    type: 'postgres',
    config: {
        host: 'localhost:5432',
    },
    credentials: {
        account: 'postgres',
        password: 'postgres',
    },
};
// Agent configuration
exports.agentConfig = {
    label: 'Credo REST API Agent',
    walletConfig: {
        id: 'credo_wallets',
        key: 'credo_wallets_key',
        keyDerivationMethod: core_1.KeyDerivationMethod.Argon2IMod,
        storage: exports.askarPostgresStorageConfig,
    },
    autoUpdateStorageOnStartup: true,
};
// Server configuration
exports.serverConfig = {
    port: 3003,
    endpoint: 'http://localhost:3003',
};
//# sourceMappingURL=config.js.map