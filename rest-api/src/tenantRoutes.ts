import express from 'express'
import type { Request, Response, RequestHandler } from 'express'
import type { Agent } from '@credo-ts/core'
import { TenantWalletManager } from './tenantWallet'

export const createTenantRoutes = (agent: Agent) => {
  const router = express.Router()
  const tenantWalletManager = new TenantWalletManager(agent)

  // Create a new user wallet
  const createWalletHandler: RequestHandler = async (req, res) => {
    try {
      const { userId, key } = req.body

      if (!userId || !key) {
        res.status(400).json({ error: 'userId and key are required' })
        return
      }

      await tenantWalletManager.createUserWallet(userId, key)
      
      res.status(201).json({
        success: true,
        userId,
        message: `Wallet for user ${userId} created successfully`,
      })
    } catch (error) {
      console.error('Error creating user wallet:', error)
      res.status(500).json({ error: 'Failed to create user wallet' })
    }
  }
  
  router.post('/create', createWalletHandler)

  // Create a new DID for a user
  const createDidHandler: RequestHandler<{ userId: string }> = async (req, res) => {
    try {
      const { userId } = req.params
      const { key, method = 'key', keyType = 'ed25519' } = req.body

      if (!key) {
        res.status(400).json({ error: 'key is required' })
        return
      }

      // Create a DID for the user
      const result = await tenantWalletManager.createUserDid(userId, key, method, keyType)
      
      res.status(201).json({
        userId,
        did: result.did,
        didDocument: result.didDocument,
      })
    } catch (error) {
      console.error('Error creating DID:', error)
      res.status(500).json({ error: 'Failed to create DID' })
    }
  }
  
  router.post('/:userId/did/create', createDidHandler)

  // List all DIDs for a user
  const listDidsHandler: RequestHandler<{ userId: string }> = async (req, res) => {
    try {
      const { userId } = req.params
      const { key } = req.query

      if (!key) {
        res.status(400).json({ error: 'key query parameter is required' })
        return
      }

      // List DIDs for the user
      const dids = await tenantWalletManager.listUserDids(userId, key as string)
      
      res.status(200).json({
        userId,
        dids,
      })
    } catch (error) {
      console.error('Error listing DIDs:', error)
      res.status(500).json({ error: 'Failed to list DIDs' })
    }
  }
  
  router.get('/:userId/did/list', listDidsHandler)

  return router
}
