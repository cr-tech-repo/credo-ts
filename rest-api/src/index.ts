import express from 'express'
import { setupAgent } from './agent'
import { createTenantRoutes } from './tenantRoutes'
import { serverConfig } from './config'

const app = express()
app.use(express.json())

// Start the application
const start = async () => {
  try {
    // Set up the agent
    const { agent } = await setupAgent()
    
    // Register routes
    app.use('/api/tenants', createTenantRoutes(agent))
    
    // Start the server
    app.listen(serverConfig.port, () => {
      console.log(`Server running on port ${serverConfig.port}`)
      console.log(`Agent initialized with wallet ID: ${agent.config.walletConfig?.id}`)
    })
  } catch (error) {
    console.error('Error starting the application:', error)
    process.exit(1)
  }
}

start()
