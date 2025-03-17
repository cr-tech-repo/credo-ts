import type { InitConfig,  ConsoleLogger } from '@credo-ts/core'
import type { AskarWalletPostgresStorageConfig } from '@credo-ts/askar'
import { KeyDerivationMethod } from '@credo-ts/core';

// PostgreSQL configuration for Askar
export const askarPostgresStorageConfig: AskarWalletPostgresStorageConfig = {
  type: 'postgres',
  config: {
    host: 'localhost:5432',
  },
  credentials: {
    account: 'postgres',
    password: 'postgres',
  },
}

// Agent configuration
export const agentConfig: InitConfig = {
  label: 'Credo REST API Agent',
  walletConfig: {
    id: 'credo_wallets',
    key: 'credo_wallets_key',
    keyDerivationMethod: KeyDerivationMethod.Argon2IMod,
    storage: askarPostgresStorageConfig,
  },
  autoUpdateStorageOnStartup: true,
}

// Server configuration
export const serverConfig = {
  port: 3003,
  endpoint: 'http://localhost:3003',
}
