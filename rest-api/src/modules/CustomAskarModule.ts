import { AskarModule } from '@credo-ts/askar'
import { AskarMultiWalletDatabaseScheme } from '@credo-ts/askar'
import { askar } from '@openwallet-foundation/askar-nodejs'

export class CustomAskarModule extends AskarModule {
  public constructor() {
    super({
      askar,
      multiWalletDatabaseScheme: AskarMultiWalletDatabaseScheme.ProfilePerWallet
    })
  }
}
