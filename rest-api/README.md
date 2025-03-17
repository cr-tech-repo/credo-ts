# Credo REST API

A RESTful API for interacting with a Credo agent, providing endpoints for managing DIDs and other SSI operations.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)
- [Database Structure](#database-structure)
- [Troubleshooting](#troubleshooting)
- [Dependencies](#dependencies)

## Overview

This REST API provides a simple interface to interact with a Credo agent. It allows you to:

- Check the health of the API
- Get wallet information
- Create and manage DIDs
- Perform other SSI (Self-Sovereign Identity) operations

The API uses the Credo TypeScript framework (formerly Aries Framework JavaScript) to interact with the underlying SSI infrastructure.

## Prerequisites

Before setting up the REST API, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (running on localhost:5432)
- Docker (optional, for running PostgreSQL in a container)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd rest-api
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Configuration

The API configuration is defined in `src/config.ts`. The main components are:

### PostgreSQL Configuration

```typescript
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
```

You can modify this configuration to match your PostgreSQL setup.

### Agent Configuration

```typescript
export const agentConfig: InitConfig = {
  label: 'Credo REST API Agent',
  walletConfig: {
    id: 'rest-api-wallet',
    key: 'rest-api-wallet-key',
    storage: askarPostgresStorageConfig,
  },
  autoUpdateStorageOnStartup: true,
}
```

This configuration defines:
- `label`: A human-readable label for the agent
- `walletConfig.id`: The ID of the wallet (also used as the database name)
- `walletConfig.key`: The encryption key for the wallet
- `walletConfig.storage`: The storage configuration (PostgreSQL in this case)
- `autoUpdateStorageOnStartup`: Whether to automatically update the storage schema on startup

### Server Configuration

```typescript
export const serverConfig = {
  port: 3003,
  endpoint: 'http://localhost:3003',
}
```

This configuration defines:
- `port`: The port on which the API server will listen
- `endpoint`: The base URL for the API

## Running the API

1. Ensure PostgreSQL is running:

```bash
pg_isready -h localhost -p 5432
```

2. Start the API server:

```bash
npm run start
```

For development with automatic reloading:

```bash
npm run dev
```

The API will be available at `http://localhost:3003`.

## API Endpoints

The API provides the following endpoints:

### Health Check

```
GET /api/health
```

Returns the health status of the API.

Example response:
```json
{
  "status": "ok"
}
```

### Wallet Information

```
GET /api/wallet/info
```

Returns information about the wallet.

Example response:
```json
{
  "isInitialized": true,
  "isProvisioned": true,
  "walletId": "rest-api-wallet"
}
```

### Create DID

```
POST /api/wallet/did/create
```

Creates a new DID in the wallet.

Request body:
```json
{
  "method": "key",
  "keyType": "ed25519"
}
```

Example response:
```json
{
  "did": "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn",
  "didDocument": {
    "@context": [
      "https://w3id.org/did/v1",
      "https://w3id.org/security/suites/ed25519-2018/v1",
      "https://w3id.org/security/suites/x25519-2019/v1"
    ],
    "id": "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn",
    "verificationMethod": [
      {
        "id": "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn#z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn",
        "type": "Ed25519VerificationKey2018",
        "controller": "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn",
        "publicKeyBase58": "BQxGdVAfZdrinRCqV59TryL3tfDhTkfKnXD2jAmh9KyQ"
      }
    ],
    "authentication": [
      "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn#z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn"
    ],
    "assertionMethod": [
      "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn#z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn"
    ],
    "keyAgreement": [
      {
        "id": "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn#z6LSdv7FQ4nAq9BT8Kd97dGjeWxk7uyneHJyZ5NHtnqiVj4W",
        "type": "X25519KeyAgreementKey2019",
        "controller": "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn",
        "publicKeyBase58": "3Ew5skyJjgTi2wFNayknKvkGGmSfwg8pg6ecQLCBnMHk"
      }
    ],
    "capabilityInvocation": [
      "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn#z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn"
    ],
    "capabilityDelegation": [
      "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn#z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn"
    ]
  }
}
```

### List DIDs

```
GET /api/wallet/did/list
```

Lists all DIDs in the wallet.

Example response:
```json
{
  "dids": [
    {
      "did": "did:key:z6MkpsDKDjR6uBMBtv3YAe7Ji4t3iEVYsdugUY7xZSji4Ykn"
    }
  ]
}
```

## Database Structure

### Database Engine and Storage

The Credo REST API uses **PostgreSQL** as its database engine for storing wallet data. When the agent is initialized, it creates a PostgreSQL database named after the wallet ID specified in the configuration. In our case, the database is named `rest-api-wallet`.

The database connection is configured in `src/config.ts`:

```typescript
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
```

### Database Tables and Their Purpose

The wallet database contains four main tables, each serving a specific purpose in the Credo agent's storage system:

#### 1. config

The `config` table stores global wallet configuration parameters.

**Table Structure:**
- `name`: Configuration parameter name
- `value`: Configuration parameter value

**What's Stored:**
- `default_profile`: The default wallet profile name (matches the wallet ID)
- `key`: The key derivation function and salt used for encryption
- `version`: The schema version of the wallet database

**Example Data:**
```
      name       |                          value                           
-----------------+----------------------------------------------------------
 default_profile | rest-api-wallet
 key             | kdf:argon2i:13:mod?salt=a6de9b0ceaefe2c8dd7d3ba061fb76b9
 version         | 1
```

#### 2. profiles

The `profiles` table stores information about wallet profiles, including their encryption keys.

**Table Structure:**
- `id`: Unique identifier for the profile
- `name`: Profile name (matches the wallet ID)
- `reference`: Optional reference to another profile
- `profile_key`: Encrypted profile key used for securing wallet data

**What's Stored:**
- Each row represents a wallet profile
- The `profile_key` is a binary representation of the encryption key used to secure items in this profile

**Example Data:**
```
 id |      name       | reference |                                                                                                                                                                                                                                                                   profile_key                                                                                                                                                                                                                                                                    
----+-----------------+-----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  1 | rest-api-wallet |           | \x396b906e35c31eed8a05b46a355b5e42f4c8ffd5fbfacc25610eac21633cc6063ecd908b71f3390b5daac0e81dde65b076a1ba137eaf9290311120907bafee92ed2c3f32a3212c9aa8d54b2101bfd28cff975d53d7f1142ff758fd10dc5011090c3fe9ff5a040a91319903b79603a0acdbfe9f87ea0027f393338b5dce2fa44332394e8684a9eb50dec9fb2171453f94d1964bb59317c766dbc77db973d86f3dc4d8c723a7ebbed098ad426195f43ba82f3babe2a900e70c9f8973742e2c76f6b8e545dc742224d368292a0f25427ca18a02c18af3ca927d158b281d327004cadadaf6fe592797e23ad0a49cba282a9578d807f566795b1e29b4f6996aad868283574267319d75
```

#### 3. items

The `items` table is the core storage table that contains all wallet items such as DIDs, credentials, keys, and other data.

**Table Structure:**
- `id`: Unique identifier for the item
- `profile_id`: Reference to the profile this item belongs to
- `kind`: Type of item (numeric code)
- `category`: Encrypted category identifier
- `name`: Encrypted item name/identifier
- `value`: Encrypted item value (contains the actual data)
- `expiry`: Optional expiration timestamp

**What's Stored:**
- **DIDs**: Decentralized Identifiers and their associated private keys
- **Credentials**: Verifiable credentials issued to the agent
- **Keys**: Cryptographic keys used by the agent
- **Connections**: Information about connections with other agents
- **Metadata**: Various metadata related to agent operations

**Item Kinds (common values):**
- `1`: Key
- `2`: DID
- `3`: Connection
- `4`: Credential

**Example Data:**
```
 id | profile_id | kind |                                               category                                               |                                                                        name                                                                        |                                                                                                                                                                                                                                                                 value                                                                                                                                                                                                                                                                  | expiry 
----+------------+------+------------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+--------
  1 |          1 |    2 | \xb21f519e4d013ff00e177610708dfd6aaaabe584911517d5891d97f16a1edf53784e5bbf45ab6d8981a73a511e3307de   | \x0741f63cfc25aac0d70723b62d9f8779eed8d904c9b8ea943fe2e32a41e96b23a112bb20d449b1c08ecb5a2e88bf9f2f92be0d42b0                                       | \x392ccbe7f494a036f646e73265a21b011c4cdcfed6d3e5882bca8da6b9d41084f8b49db73f6d4d34ddbcb7a55a0e7fecdefefcdd449338a06e0f6175ef61ea33e37e0a12e3f8e1f6e37650719d9eba9424dfb9dc1664badfe4a00e3b83dda72178ff034cece9838a01797c656afa2f2a7b8e6d0e600bdef5a71cbd76d02c67b304db40099f1070b7f125c2f8e82df92dea4b5f4c240a7dd68fce3a371650b5a377bdabf4bfe0e9564bbfdff095659e6d4af4ff57fa3f62256e61a540                                                                                                                                             | 
```

In this example, item with `id=1` and `kind=2` is a DID. The actual DID and its associated keys are stored in the encrypted `value` field.

#### 4. items_tags

The `items_tags` table stores searchable tags associated with wallet items, enabling efficient querying without decrypting all items.

**Table Structure:**
- `id`: Unique identifier for the tag
- `item_id`: Reference to the item this tag belongs to
- `name`: Encrypted tag name
- `value`: Encrypted tag value
- `plaintext`: Flag indicating if the value is stored in plaintext (0 = encrypted, 1 = plaintext)

**What's Stored:**
- **DID Tags**: Tags like `did`, `method`, and `keyType` for DID items
- **Credential Tags**: Tags like `schemaId`, `credentialDefinitionId` for credential items
- **Connection Tags**: Tags like `theirDid`, `state` for connection items
- **Search Tags**: Custom tags added to items for efficient searching

**Example Data:**
```
 id | item_id |                                                    name                                                    |                                                                                   value                                                                                    | plaintext 
----+---------+------------------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------
  1 |       2 | \x7dd43dabc51aace481635a4d4a3f61f3b0f1c0ce1f32dc5ffe8cec858c0b98                                           | \x4e4bee4808d2fd0b9edc00eb0a400d0d6fae89d9098c83f3ce6e357e7d99290cc4c5f0                                                                                                   |         0
```

In this example, the tag with `id=1` is associated with the item with `item_id=2`. The tag name and value are encrypted for security.

### Data Encryption and Security

All sensitive data in the database is encrypted using the wallet key specified in the configuration. The encryption ensures that:

1. **Data at Rest Security**: Even if someone gains access to the database, they cannot read the sensitive information without the wallet key.

2. **Selective Disclosure**: The agent can selectively decrypt only the items it needs, improving performance.

3. **Key Isolation**: Private keys are never stored in plaintext in the database.

The encryption is handled by the Askar secure storage system, which is part of the Credo framework. The encryption uses industry-standard cryptographic algorithms to protect the data.

### Database Queries and Access

The Credo agent interacts with the database through the Askar storage layer, which provides a high-level API for:

- Creating and retrieving wallet items
- Searching for items using tags
- Managing wallet profiles
- Handling encryption and decryption

Direct SQL queries to the database are generally not needed when using the Credo API, as all database operations are abstracted by the framework.

## Troubleshooting

### Common Issues

#### Module Resolution Error

If you encounter a module resolution error like:

```
Error: Cannot find module '/path/to/node_modules/@credo-ts/didcomm/node_modules/@credo-ts/core/build/index'
```

This is likely due to a version mismatch between the @credo-ts packages. Ensure all packages are using the same version (either all stable or all alpha).

#### DID Creation Error

If you encounter an error when creating a DID:

```
Error creating DID: TypeError: Cannot read properties of undefined (reading 'keyType')
```

Make sure to include the `keyType` parameter in the request body:

```json
{
  "method": "key",
  "keyType": "ed25519"
}
```

#### Database Connection Issues

If you encounter database connection issues, ensure PostgreSQL is running and accessible:

```bash
pg_isready -h localhost -p 5432
```

Also, check that the database credentials in `src/config.ts` match your PostgreSQL setup.

## Dependencies

The REST API depends on the following main packages:

- `@credo-ts/core`: Core functionality of the Credo framework
- `@credo-ts/askar`: Integration with the Askar secure storage
- `@credo-ts/didcomm`: DIDComm messaging capabilities
- `@credo-ts/node`: Node.js-specific utilities for Credo
- `@openwallet-foundation/askar-nodejs`: Node.js bindings for Askar
- `@openwallet-foundation/askar-shared`: Shared utilities for Askar
- `express`: Web framework for the REST API
- `typescript`: TypeScript language support

For a complete list of dependencies, see the `package.json` file.

## Project Structure

```
rest-api/
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
├── src/                # Source code
│   ├── index.ts        # Entry point
│   ├── config.ts       # Configuration
│   ├── agent.ts        # Agent setup
│   ├── routes.ts       # API routes
│   └── modules/        # Custom modules
│       └── CustomAskarModule.ts  # Custom Askar module
└── dist/               # Compiled JavaScript (generated)
```

## License

This project is licensed under the ISC License - see the LICENSE file for details.
