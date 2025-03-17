import { Agent, WalletConfig, KeyDerivationMethod, DidDocument } from '@credo-ts/core'
import { AskarWallet } from '@credo-ts/askar'

/**
 * Class to manage user wallets using the ProfilePerWallet scheme
 */
export class UserWalletManager {
  private agent: Agent
  private userDids: Map<string, { did: string, didDocument: DidDocument }[]> = new Map()

  constructor(agent: Agent) {
    this.agent = agent
    console.log('UserWalletManager initialized')
  }

  /**
   * Create a new wallet profile for a user
   * @param userId The user ID to create a wallet for
   * @param key The key to encrypt the wallet with
   */
  public async createUserWallet(userId: string, key: string): Promise<void> {
    try {
      // Initialize an empty array for the user's DIDs
      if (!this.userDids.has(userId)) {
        this.userDids.set(userId, [])
      }
      
      console.log(`Created profile for user ${userId}`)
    } catch (error) {
      console.error(`Error creating wallet for user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Create a DID for a user
   * @param userId The user ID to create a DID for
   * @param key The key to decrypt the wallet with
   * @param method The DID method to use
   * @param keyType The key type to use
   * @returns The created DID and DID document
   */
  public async createUserDid(
    userId: string, 
    key: string, 
    method: string = 'key', 
    keyType: string = 'ed25519'
  ) {
    try {
      // Create a DID using the agent's DID module
      const createResult = await this.agent.dids.create({
        method,
        options: {
          keyType,
        },
      })
      
      // Store the DID for the user
      if (!this.userDids.has(userId)) {
        this.userDids.set(userId, [])
      }
      
      const userDidList = this.userDids.get(userId)
      if (userDidList && createResult.didState.did && createResult.didState.didDocument) {
        userDidList.push({
          did: createResult.didState.did,
          didDocument: createResult.didState.didDocument,
        })
      }
      
      return {
        did: createResult.didState.did,
        didDocument: createResult.didState.didDocument,
      }
    } catch (error) {
      console.error(`Error creating DID for user ${userId}:`, error)
      throw error
    }
  }

  /**
   * List all DIDs for a user
   * @param userId The user ID to list DIDs for
   * @param key The key to decrypt the wallet with
   * @returns An array of DIDs
   */
  public async listUserDids(userId: string, key: string) {
    try {
      // Get the user's DIDs
      const dids = this.userDids.get(userId) || []
      
      return dids.map(record => ({
        did: record.did
      }))
    } catch (error) {
      console.error(`Error listing DIDs for user ${userId}:`, error)
      throw error
    }
  }
}
