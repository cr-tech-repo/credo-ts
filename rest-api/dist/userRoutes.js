"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRoutes = void 0;
const express_1 = require("express");
const userWallet_1 = require("./userWallet");
const createUserRoutes = (agent) => {
    const router = (0, express_1.Router)();
    const userWalletManager = new userWallet_1.UserWalletManager(agent);
    // Create a new user wallet
    router.post('/create', async (req, res) => {
        try {
            const { userId, key } = req.body;
            if (!userId || !key) {
                return res.status(400).json({ error: 'userId and key are required' });
            }
            await userWalletManager.createUserWallet(userId, key);
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
    });
    // Create a new DID for a user
    router.post('/:userId/did/create', async (req, res) => {
        try {
            const { userId } = req.params;
            const { key, method = 'key', keyType = 'ed25519' } = req.body;
            if (!key) {
                return res.status(400).json({ error: 'key is required' });
            }
            // Create a DID for the user
            const result = await userWalletManager.createUserDid(userId, key, method, keyType);
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
    });
    // List all DIDs for a user
    router.get('/:userId/did/list', async (req, res) => {
        try {
            const { userId } = req.params;
            const { key } = req.query;
            if (!key) {
                return res.status(400).json({ error: 'key query parameter is required' });
            }
            // List DIDs for the user
            const dids = await userWalletManager.listUserDids(userId, key);
            res.status(200).json({
                userId,
                dids,
            });
        }
        catch (error) {
            console.error('Error listing DIDs:', error);
            res.status(500).json({ error: 'Failed to list DIDs' });
        }
    });
    return router;
};
exports.createUserRoutes = createUserRoutes;
//# sourceMappingURL=userRoutes.js.map