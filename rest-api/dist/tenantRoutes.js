"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTenantRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tenantWallet_1 = require("./tenantWallet");
const createTenantRoutes = (agent) => {
    const router = express_1.default.Router();
    const tenantWalletManager = new tenantWallet_1.TenantWalletManager(agent);
    // Create a new user wallet
    const createWalletHandler = async (req, res) => {
        try {
            const { userId, key } = req.body;
            if (!userId || !key) {
                res.status(400).json({ error: 'userId and key are required' });
                return;
            }
            await tenantWalletManager.createUserWallet(userId, key);
            res.status(201).json({
                success: true,
                userId,
                message: `Wallet for user ${userId} created successfully`,
            });
        }
        catch (error) {
            console.error('Error creating user wallet:', error);
            res.status(500).json({ error: 'Failed to create user wallet' });
        }
    };
    router.post('/create', createWalletHandler);
    // Create a new DID for a user
    const createDidHandler = async (req, res) => {
        try {
            const { userId } = req.params;
            const { key, method = 'key', keyType = 'ed25519' } = req.body;
            if (!key) {
                res.status(400).json({ error: 'key is required' });
                return;
            }
            // Create a DID for the user
            const result = await tenantWalletManager.createUserDid(userId, key, method, keyType);
            res.status(201).json({
                userId,
                did: result.did,
                didDocument: result.didDocument,
            });
        }
        catch (error) {
            console.error('Error creating DID:', error);
            res.status(500).json({ error: 'Failed to create DID' });
        }
    };
    router.post('/:userId/did/create', createDidHandler);
    // List all DIDs for a user
    const listDidsHandler = async (req, res) => {
        try {
            const { userId } = req.params;
            const { key } = req.query;
            if (!key) {
                res.status(400).json({ error: 'key query parameter is required' });
                return;
            }
            // List DIDs for the user
            const dids = await tenantWalletManager.listUserDids(userId, key);
            res.status(200).json({
                userId,
                dids,
            });
        }
        catch (error) {
            console.error('Error listing DIDs:', error);
            res.status(500).json({ error: 'Failed to list DIDs' });
        }
    };
    router.get('/:userId/did/list', listDidsHandler);
    return router;
};
exports.createTenantRoutes = createTenantRoutes;
//# sourceMappingURL=tenantRoutes.js.map