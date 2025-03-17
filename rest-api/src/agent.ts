import { Agent } from '@credo-ts/core'
import { getDefaultDidcommModules } from '@credo-ts/didcomm'
import { registerAskar } from '@openwallet-foundation/askar-shared'
import { askar } from '@openwallet-foundation/askar-nodejs'
import { agentDependencies } from '@credo-ts/node'

import { agentConfig } from './config'
import { CustomAskarModule } from './modules/CustomAskarModule'

export const setupAgent = async () => {
  // Register Askar
  registerAskar({ askar })
  
  // Create agent with custom Askar module and default DIDComm modules
  const agent = new Agent({
    config: agentConfig,
    dependencies: agentDependencies,
    modules: {
      askar: new CustomAskarModule(),
      ...getDefaultDidcommModules({
        didCommMimeType: 'application/didcomm-envelope-enc',
      }),
    },
  })

  // Initialize agent
  await agent.initialize()

  return {
    agent,
  }
}
