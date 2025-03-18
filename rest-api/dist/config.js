"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = exports.agentConfig = exports.askarPostgresStorageConfig = void 0;
const core_1 = require("@credo-ts/core");
// PostgreSQL configuration for Askar
exports.askarPostgresStorageConfig = {
    type: 'postgres',
    config: {
        host: 'db.savwotjxaqcwctumxtim.supabase.co:5432',
        maxConnections: 10,
        minConnections: 1,
        connectTimeout: 1000,
        idleTimeout: 1000
    },
    credentials: {
        account: 'walletdbuser',
        password: 'passwordofwalletdb',
    },
};
// Agent configuration
exports.agentConfig = {
    label: 'Credo REST API Agent',
    walletConfig: {
        id: 'digital_wallet',
        key: '1ba26c052dc4d309c55255097b547f968147c750f4c1b35ecae1d0edb3f6430a',
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