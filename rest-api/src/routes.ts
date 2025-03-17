import { Router } from 'express'
import type { Agent } from '@credo-ts/core'

export const createRoutes = (agent: Agent) => {
  const router = Router()

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  // Wallet info endpoint
  router.get('/wallet/info', async (req, res) => {
    try {
      const isInitialized = agent.wallet.isInitialized
      const isProvisioned = agent.wallet.isProvisioned
      
      res.status(200).json({
        isInitialized,
        isProvisioned,
        walletId: agent.config.walletConfig?.id,
      })
    } catch (error) {
      console.error('Error getting wallet info:', error)
      res.status(500).json({ error: 'Failed to get wallet info' })
    }
  })

  // Create a new DID in the wallet
  router.post('/wallet/did/create', async (req, res) => {
    try {
      const { method = 'key', keyType = 'ed25519' } = req.body
      
      const createResult = await agent.dids.create({
        method,
        options: {
          keyType,
        },
      })
      
      res.status(201).json({
        did: createResult.didState.did,
        didDocument: createResult.didState.didDocument,
      })
    } catch (error) {
      console.error('Error creating DID:', error)
      res.status(500).json({ error: 'Failed to create DID' })
    }
  })

  // List all DIDs in the wallet
  router.get('/wallet/did/list', async (req, res) => {
    try {
      const dids = await agent.dids.getCreatedDids()
      
      res.status(200).json({
        dids: dids.map((didRecord) => ({
          did: didRecord.did,
        })),
      })
    } catch (error) {
      console.error('Error listing DIDs:', error)
      res.status(500).json({ error: 'Failed to list DIDs' })
    }
  })

  return router
}
