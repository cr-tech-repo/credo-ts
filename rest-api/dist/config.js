"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = exports.agentConfig = exports.askarPostgresStorageConfig = void 0;
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
        id: 'rest-api-wallet',
        key: 'rest-api-wallet-key',
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