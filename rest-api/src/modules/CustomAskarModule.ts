import { AskarModule } from '@credo-ts/askar'
import { askar } from '@openwallet-foundation/askar-nodejs'

export class CustomAskarModule extends AskarModule {
  public constructor() {
    // @ts-ignore - Ignore the type error for now
    super({ askar })
  }
}
