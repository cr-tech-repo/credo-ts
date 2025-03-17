"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAskarModule = void 0;
const askar_1 = require("@credo-ts/askar");
const askar_2 = require("@credo-ts/askar");
const askar_nodejs_1 = require("@openwallet-foundation/askar-nodejs");
class CustomAskarModule extends askar_1.AskarModule {
    constructor() {
        super({
            askar: askar_nodejs_1.askar,
            multiWalletDatabaseScheme: askar_2.AskarMultiWalletDatabaseScheme.ProfilePerWallet
        });
    }
}
exports.CustomAskarModule = CustomAskarModule;
//# sourceMappingURL=CustomAskarModule.js.map