"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantWalletManager = void 0;
/**
 * Class to manage user wallets using the tenant functionality
 */
class TenantWalletManager {
    constructor(agent) {
        this.agent = agent;
        console.log('TenantWalletManager initialized');
    }
    /**
     * Create a new tenant for a user
     * @param userId The user ID to create a tenant for
     * @param key The key to encrypt the wallet with
     */
    async createUserWallet(userId, key) {
        try {
            // Check if the tenant already exists
            const tenants = await this.agent.modules.tenants.getAllTenants();
            const existingTenant = tenants.find((tenant) => tenant.config.label === `User ${userId}`);
            if (existingTenant) {
                console.log(`Tenant for user ${userId} already exists`);
                return;
            }
            // Create a tenant for the user
            await this.agent.modules.tenants.createTenant({
                config: {
                    label: `User ${userId}`,
                },
            });
            console.log(`Created tenant for user ${userId}`);
        }
        catch (error) {
            console.error(`Error creating tenant for user ${userId}:`, error);
            throw error;
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
    async createUserDid(userId, key, method = 'key', keyType = 'ed25519') {
        try {
            // Find the tenant for the user by label
            const tenants = await this.agent.modules.tenants.findTenantsByLabel(`User ${userId}`);
            if (!tenants || tenants.length === 0) {
                throw new Error(`Tenant for user ${userId} not found`);
            }
            const tenantRecord = tenants[0];
            // Create a DID using the tenant's agent
            return await this.agent.modules.tenants.withTenantAgent({ tenantId: tenantRecord.id }, async (tenantAgent) => {
                const createResult = await tenantAgent.dids.create({
                    method,
                    options: {
                        keyType,
                    },
                });
                return {
                    did: createResult.didState.did,
                    didDocument: createResult.didState.didDocument,
                };
            });
        }
        catch (error) {
            console.error(`Error creating DID for user ${userId}:`, error);
            throw error;
        }
    }
    /**
     * List all DIDs for a user
     * @param userId The user ID to list DIDs for
     * @param key The key to decrypt the wallet with
     * @returns An array of DIDs
     */
    async listUserDids(userId, key) {
        try {
            // Find the tenant for the user by label
            const tenants = await this.agent.modules.tenants.findTenantsByLabel(`User ${userId}`);
            if (!tenants || tenants.length === 0) {
                throw new Error(`Tenant for user ${userId} not found`);
            }
            const tenantRecord = tenants[0];
            // List DIDs using the tenant's agent
            return await this.agent.modules.tenants.withTenantAgent({ tenantId: tenantRecord.id }, async (tenantAgent) => {
                const dids = await tenantAgent.dids.getCreatedDids();
                return dids.map((didRecord) => ({
                    did: didRecord.did,
                }));
            });
        }
        catch (error) {
            console.error(`Error listing DIDs for user ${userId}:`, error);
            throw error;
        }
    }
}
exports.TenantWalletManager = TenantWalletManager;
//# sourceMappingURL=tenantWallet.js.map