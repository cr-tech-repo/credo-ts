import type { InitConfig, ConsoleLogger } from '@credo-ts/core'
import type { AskarWalletPostgresStorageConfig } from '@credo-ts/askar'
import { KeyDerivationMethod } from '@credo-ts/core'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// PostgreSQL configuration for Askar
export const askarPostgresStorageConfig: AskarWalletPostgresStorageConfig = {
  type: 'postgres',
  config: {
    host: process.env.DB_HOST || 'localhost:5432',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
    minConnections: parseInt(process.env.DB_MIN_CONNECTIONS || '1'),
    connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '1000'),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '1000')
  },
  credentials: {
    account: process.env.DB_USER || 'default_user',
    password: process.env.DB_PASSWORD || 'default_password',
  },
}

// Agent configuration
export const agentConfig: InitConfig = {
  label: process.env.AGENT_LABEL || 'Credo REST API Agent',
  walletConfig: {
    id: process.env.WALLET_ID || 'digital_wallet',
    key: process.env.WALLET_KEY || '1ba26c052dc4d309c55255097b547f968147c750f4c1b35ecae1d0edb3f6430a',
    keyDerivationMethod: KeyDerivationMethod.Argon2IMod,
    storage: askarPostgresStorageConfig,
  },
  autoUpdateStorageOnStartup: true,
}

// Server configuration
export const serverConfig = {
  port: parseInt(process.env.SERVER_PORT || '3003'),
  endpoint: process.env.SERVER_ENDPOINT || 'http://localhost:3003',
}
