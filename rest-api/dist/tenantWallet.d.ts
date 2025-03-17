import { Agent } from '@credo-ts/core';
/**
 * Class to manage user wallets using the tenant functionality
 */
export declare class TenantWalletManager {
    private agent;
    constructor(agent: Agent);
    /**
     * Create a new tenant for a user
     * @param userId The user ID to create a tenant for
     * @param key The key to encrypt the wallet with
     */
    createUserWallet(userId: string, key: string): Promise<void>;
    /**
     * Create a DID for a user
     * @param userId The user ID to create a DID for
     * @param key The key to decrypt the wallet with
     * @param method The DID method to use
     * @param keyType The key type to use
     * @returns The created DID and DID document
     */
    createUserDid(userId: string, key: string, method?: string, keyType?: string): Promise<any>;
    /**
     * List all DIDs for a user
     * @param userId The user ID to list DIDs for
     * @param key The key to decrypt the wallet with
     * @returns An array of DIDs
     */
    listUserDids(userId: string, key: string): Promise<any>;
}
