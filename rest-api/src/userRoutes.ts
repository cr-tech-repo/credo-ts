import express, { Router, Request, Response } from 'express'
import type { Agent } from '@credo-ts/core'
import { UserWalletManager } from './userWallet'

export const createUserRoutes = (agent: Agent) => {
  const router = Router()
  const userWalletManager = new UserWalletManager(agent)

  // Create a new user wallet
  router.post('/create', async (req: Request, res: Response) => {
    try {
      const { userId, key } = req.body

      if (!userId || !key) {
        return res.status(400).json({ error: 'userId and key are required' })
      }

      await userWalletManager.createUserWallet(userId, key)
      
      res.status(201).json({
        success: true,
        userId,
        message: `Wallet for user ${userId} created successfully`,
      })
    } catch (error) {
      console.error('Error creating user wallet:', error)
      res.status(500).json({ error: 'Failed to create user wallet' })
    }
  })

  // Create a new DID for a user
  router.post('/:userId/did/create', async (req: Request<{ userId: string }>, res: Response) => {
    try {
      const { userId } = req.params
      const { key, method = 'key', keyType = 'ed25519' } = req.body

      if (!key) {
        return res.status(400).json({ error: 'key is required' })
      }

      // Create a DID for the user
      const result = await userWalletManager.createUserDid(userId, key, method, keyType)
      
      res.status(201).json({
        userId,
        did: result.did,
        didDocument: result.didDocument,
      })
    } catch (error) {
      console.error('Error creating DID:', error)
      res.status(500).json({ error: 'Failed to create DID' })
    }
  })

  // List all DIDs for a user
  router.get('/:userId/did/list', async (req: Request<{ userId: string }>, res: Response) => {
    try {
      const { userId } = req.params
      const { key } = req.query

      if (!key) {
        return res.status(400).json({ error: 'key query parameter is required' })
      }

      // List DIDs for the user
      const dids = await userWalletManager.listUserDids(userId, key as string)
      
      res.status(200).json({
        userId,
        dids,
      })
    } catch (error) {
      console.error('Error listing DIDs:', error)
      res.status(500).json({ error: 'Failed to list DIDs' })
    }
  })

  return router
}
