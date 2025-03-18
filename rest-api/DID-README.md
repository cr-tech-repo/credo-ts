# Decentralized Identifiers (DIDs) in Credo REST API

This document provides comprehensive guidance on implementing and using DIDs in your Credo-based REST API application.

## Table of Contents

1. [Introduction to DIDs](#introduction-to-dids)
2. [DID Methods in Credo](#did-methods-in-credo)
3. [Strategic DID Usage](#strategic-did-usage)
4. [Implementation Guide](#implementation-guide)
5. [Automatic DID Management](#automatic-did-management)
6. [OpenID4VC Integration](#openid4vc-integration)
7. [AnonCreds and DIDs](#anoncreds-and-dids)
8. [Docker Deployment Considerations](#docker-deployment-considerations)
9. [API Endpoints Reference](#api-endpoints-reference)
10. [Advanced Topics](#advanced-topics)

## Introduction to DIDs

Decentralized Identifiers (DIDs) are a type of identifier that enables verifiable, self-sovereign digital identity. DIDs are:

- **Decentralized**: No central issuing agency
- **Persistent**: Designed to be permanent and unchanging
- **Resolvable**: Can be resolved to a DID Document
- **Cryptographically Verifiable**: Ownership can be proven cryptographically

In your multi-user wallet application, DIDs serve multiple purposes:
- Authentication and identification
- Secure communication channels
- Credential issuance and verification
- Relationship management

## DID Methods in Credo

Credo supports several DID methods out of the box:

### did:key
- **Description**: Simplest DID method that directly encodes a public key
- **Use Cases**: Authentication, simple peer-to-peer interactions
- **Advantages**: No external dependencies, lightweight, portable
- **Limitations**: No update capability, limited functionality
- **Example**: `did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK`

### did:web
- **Description**: Uses standard web domains as the basis for DIDs
- **Use Cases**: Public organizational identities, user profiles
- **Advantages**: Easy to deploy, uses existing web infrastructure
- **Limitations**: Relies on domain ownership, centralized
- **Example**: `did:web:example.com:users:alice`

### did:peer
- **Description**: Designed specifically for peer-to-peer relationships
- **Use Cases**: Private communications, DIDComm messaging
- **Advantages**: Privacy-preserving, includes service endpoints
- **Limitations**: Not suitable for public identities
- **Example**: `did:peer:1zQmXUFoUJ6tZBcCbzfbLBGPnBuYBzxdqwbdcHkYD9NVZLSz`

### did:jwk
- **Description**: Encodes a JSON Web Key (JWK) directly in the DID
- **Use Cases**: OpenID4VC, JWT-based authentication
- **Advantages**: Compatible with OAuth/OIDC ecosystems
- **Limitations**: Similar limitations to did:key
- **Example**: `did:jwk:eyJjcnYiOiJQLTI1NiIsImt0eSI6IkVDIiwieCI6ImFjYkxOQjVIWnduY3JrTzNHRVJ5VFc4MkpzOXpSVUV3eHY5NllwOWtmVFkiLCJ5IjoiX0tjeUxqOXZXTXB0bm1LcURQeDVDdEVDaHNVTnhHQkRxVnpWV0R1RXFHUSJ9`

### did:sov and did:indy
- **Description**: Based on Hyperledger Indy blockchain
- **Use Cases**: Verifiable credentials with revocation
- **Advantages**: Strong privacy features, revocation support
- **Limitations**: Requires Indy ledger access
- **Example**: `did:sov:WRfXPg8dantKVubE3HX8pw`

### did:cheqd
- **Description**: Based on the Cheqd blockchain (Cosmos ecosystem)
- **Use Cases**: Commercial identity services
- **Advantages**: Combines DID functionality with payment capabilities
- **Limitations**: Requires Cheqd network access
- **Example**: `did:cheqd:mainnet:zF7rhDBfUt9d1gJPjx7s1JXfUY7oVWkY`

## Strategic DID Usage

For your user-to-user communication platform, we recommend a strategic combination of DID methods:

### 1. Authentication Layer
- **Primary Method**: `did:jwk` or `did:key`
- **Purpose**: User authentication with your platform
- **Creation**: Automatic during user registration
- **User Awareness**: Hidden from users

### 2. Public Identity Layer
- **Primary Method**: `did:web`
- **Purpose**: Discoverable user profiles
- **Creation**: Automatic during user registration
- **User Awareness**: Visible as profile URL

### 3. Communication Layer
- **Primary Method**: `did:peer`
- **Purpose**: Secure peer-to-peer messaging
- **Creation**: Automatic when users connect
- **User Awareness**: Hidden from users

### 4. Credential Layer (if needed)
- **Primary Methods**: `did:indy`, `did:sov`, or `did:cheqd` for issuers
- **Purpose**: Verifiable credential issuance and verification
- **Creation**: As needed for credential operations
- **User Awareness**: Hidden from users

## Implementation Guide

### Required Modules

To implement the full range of DID methods, add these modules to your agent setup:

```typescript
const agent = new Agent({
  config: agentConfig,
  dependencies: agentDependencies,
  modules: {
    // Core modules
    askar: new CustomAskarModule(),
    tenants: new TenantsModule(),
    
    // DIDComm modules
    ...getDefaultDidcommModules({
      didCommMimeType: 'application/didcomm-envelope-enc',
    }),
    
    // DID modules
    dids: new DidsModule({
      registrars: [
        new KeyDidRegistrar(),
        new WebDidRegistrar(),
        new JwkDidRegistrar(),
        new PeerDidRegistrar(),
        // Optional blockchain-based registrars
        new CheqdDidRegistrar(),
      ],
      resolvers: [
        new KeyDidResolver(),
        new WebDidResolver(),
        new JwkDidResolver(),
        new PeerDidResolver(),
        // Optional blockchain-based resolvers
        new IndyVdrIndyDidResolver(),
        new CheqdDidResolver(),
      ],
    }),
    
    // Optional: OpenID4VC support
    openid4vc: new OpenId4VcModule(),
    
    // Optional: AnonCreds support
    anoncreds: new AnonCredsModule({
      registries: [
        new IndyVdrAnonCredsRegistry(),
        new CheqdAnonCredsRegistry(),
      ],
      anoncreds,
    }),
    
    // Optional: Ledger support
    indyVdr: new IndyVdrModule({
      indyVdr,
      networks: [indyNetworkConfig],
    }),
    cheqd: new CheqdModule(
      new CheqdModuleConfig({
        networks: [
          {
            network: 'testnet',
            cosmosPayerSeed: 'your-seed-phrase-here',
          },
        ],
      })
    ),
  },
})
```

### Extending TenantWalletManager

Extend your `TenantWalletManager` class to support multiple DID methods:

```typescript
public async createUserDid(
  userId: string, 
  key: string, 
  method: string = 'key', 
  keyType: string = 'ed25519',
  options?: any
) {
  try {
    // Find the tenant for the user
    const tenants = await this.agent.modules.tenants.findTenantsByLabel(`User ${userId}`)
    
    if (!tenants || tenants.length === 0) {
      throw new Error(`Tenant for user ${userId} not found`)
    }
    
    const tenantRecord = tenants[0]
    
    // Create a DID using the tenant's agent
    return await this.agent.modules.tenants.withTenantAgent(
      { tenantId: tenantRecord.id },
      async (tenantAgent: any) => {
        const createOptions: any = {
          method,
          options: {
            keyType,
            ...options,
          },
        }
        
        // Special handling for different DID methods
        if (method === 'web') {
          createOptions.options.domain = options?.domain || 'example.com'
          createOptions.options.path = options?.path || `users/${userId}`
        } else if (method === 'peer') {
          createOptions.options.numalgo = options?.numalgo || 2
          createOptions.options.serviceEndpoint = options?.serviceEndpoint || 'https://example.com/endpoint'
        } else if (method === 'jwk') {
          // JWK specific options
        }
        
        const createResult = await tenantAgent.dids.create(createOptions)
        
        return {
          did: createResult.didState.did,
          didDocument: createResult.didState.didDocument,
        }
      }
    )
  } catch (error) {
    console.error(`Error creating DID for user ${userId}:`, error)
    throw error
  }
}
```

## Automatic DID Management

For a seamless user experience, implement automatic DID creation and management:

### User Registration Flow

```typescript
public async registerUser(userId: string, key: string): Promise<void> {
  // 1. Create tenant wallet
  await this.createUserWallet(userId, key)
  
  // 2. Create authentication DID (did:jwk for OpenID compatibility)
  const authDid = await this.createUserDid(userId, key, 'jwk')
  
  // 3. Create public profile DID (did:web)
  const profileDid = await this.createUserDid(userId, key, 'web', 'ed25519', {
    domain: 'yourplatform.com',
    path: `users/${userId}`
  })
  
  // 4. Store DID metadata
  await this.storeDidMetadata(userId, {
    authDid: authDid.did,
    profileDid: profileDid.did,
    didDocuments: {
      auth: authDid.didDocument,
      profile: profileDid.didDocument
    }
  })
}
```

### Connection Establishment

```typescript
public async createConnection(userId: string, targetUserId: string, key: string): Promise<any> {
  // 1. Create a unique did:peer for this relationship
  const connectionDid = await this.createUserDid(userId, key, 'peer', 'ed25519', {
    numalgo: 2,
    serviceEndpoint: `https://yourplatform.com/api/messaging/${userId}`
  })
  
  // 2. Generate connection invitation using this DID
  const invitation = await this.generateInvitation(userId, connectionDid.did)
  
  // 3. Store connection metadata
  await this.storeConnectionMetadata(userId, targetUserId, {
    connectionDid: connectionDid.did,
    invitation
  })
  
  return invitation
}
```

## OpenID4VC Integration

OpenID for Verifiable Credentials (OpenID4VC) works best with `did:jwk` for several reasons:

1. **JWT Compatibility**: OpenID4VC uses JWT/JWS for security, and `did:jwk` directly encodes the keys needed for JWT operations
2. **OAuth Ecosystem**: OpenID4VC extends OAuth 2.0/OpenID Connect, which commonly uses JWKs
3. **Self-Contained**: The DID contains all verification material needed for OpenID operations

### Implementation:

```typescript
// Create a did:jwk for OpenID4VC operations
public async createOpenIdDid(userId: string, key: string): Promise<any> {
  const openIdDid = await this.createUserDid(userId, key, 'jwk')
  
  // Configure OpenID4VC with this DID
  await this.agent.modules.tenants.withTenantAgent(
    { tenantId: userId },
    async (tenantAgent: any) => {
      await tenantAgent.modules.openid4vc.configureSiopProvider({
        did: openIdDid.did,
        // Other OpenID configuration
      })
    }
  )
  
  return openIdDid
}
```

## AnonCreds and DIDs

AnonCreds (Anonymous Credentials) is a credential format that supports zero-knowledge proofs. Key points:

### AnonCreds and Ledgers

1. **Traditional AnonCreds**: Originally required an Indy ledger for credential definitions and schemas
2. **Modern AnonCreds**: Can now work with multiple ledgers or ledger-less approaches

### DID Methods for AnonCreds

AnonCreds can work with various DID methods:

1. **Ledger-based methods**:
   - `did:indy` and `did:sov`: Traditional approach, full revocation support
   - `did:cheqd`: Modern approach with payment capabilities

2. **Ledger-less methods**:
   - `did:web`: Can host AnonCreds objects on web servers
   - `did:key`: Limited functionality, no native revocation

### Implementation Decision:

For your platform, you have options:

1. **Fully Ledger-less**: Use `did:web` to host AnonCreds objects
   ```typescript
   const anoncredsModule = new AnonCredsModule({
     registries: [new WebAnonCredsRegistry()],
     anoncreds,
   })
   ```

2. **Hybrid Approach**: Support both ledger and ledger-less methods
   ```typescript
   const anoncredsModule = new AnonCredsModule({
     registries: [
       new WebAnonCredsRegistry(),
       new IndyVdrAnonCredsRegistry(),
       new CheqdAnonCredsRegistry(),
     ],
     anoncreds,
   })
   ```

## Docker Deployment Considerations

When deploying your DID-enabled REST API in Docker:

### 1. Environment Variables

Configure DID-related settings via environment variables:

```yaml
environment:
  - DID_WEB_DOMAIN=yourplatform.com
  - DID_WEB_PATH_PREFIX=users
  - ENABLE_INDY_LEDGER=true
  - INDY_LEDGER_URL=http://indy-pool:9701-9708
  - ENABLE_CHEQD=false
```

### 2. Volume Mounting

Ensure wallet persistence for DIDs:

```yaml
volumes:
  - wallet_data:/app/wallet
```

### 3. Network Configuration

For ledger-based DIDs, ensure connectivity:

```yaml
services:
  rest-api:
    # ...
    depends_on:
      - postgres
      - indy-pool  # If using Indy ledger
```

## API Endpoints Reference

Implement these endpoints for comprehensive DID management:

### User Management
- `POST /api/tenants/create` - Create user wallet
- `POST /api/tenants/register` - Create user with all required DIDs

### DID Management
- `POST /api/tenants/:userId/did/create` - Create a DID
- `GET /api/tenants/:userId/did/list` - List all DIDs
- `GET /api/tenants/:userId/did/:method/create` - Create a specific DID type
- `GET /api/tenants/:userId/did/primary` - Get primary DIDs

### Connection Management
- `POST /api/tenants/:userId/connections/create` - Create connection with another user
- `POST /api/tenants/:userId/connections/accept` - Accept connection invitation

### Credential Operations
- `POST /api/tenants/:userId/credentials/issue` - Issue credential
- `POST /api/tenants/:userId/credentials/verify` - Verify credential

## Advanced Topics

### DID Rotation and Key Management

Implement key rotation for security:

```typescript
public async rotateDid(userId: string, didUri: string, key: string): Promise<any> {
  // Implementation depends on DID method
  // Some methods support key rotation, others require creating a new DID
}
```

### Cross-Platform Compatibility

For mobile wallet compatibility:

1. Use standard DID methods (`did:key`, `did:jwk`)
2. Implement standard protocols (DIDComm, OpenID4VC)
3. Support universal wallet formats

### Performance Optimization

For large-scale deployments:

1. Cache DID resolution results
2. Use connection-specific DIDs only when needed
3. Implement lazy DID creation

---

This README provides a comprehensive guide to implementing DIDs in your Credo-based REST API. By following these guidelines, you can create a secure, privacy-preserving platform where users can communicate and exchange credentials without needing to understand the underlying DID infrastructure.
