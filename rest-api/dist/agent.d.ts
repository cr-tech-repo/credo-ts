import { Agent } from '@credo-ts/core';
import { TenantsModule } from '@credo-ts/tenants';
import { CustomAskarModule } from './modules/CustomAskarModule';
export declare const setupAgent: () => Promise<{
    agent: Agent<{
        connections: import("@credo-ts/didcomm").ConnectionsModule;
        credentials: import("@credo-ts/didcomm").CredentialsModule<[]>;
        proofs: import("@credo-ts/didcomm").ProofsModule<import("@credo-ts/didcomm").DefaultProofProtocols>;
        mediator: import("@credo-ts/didcomm").MediatorModule;
        discovery: import("@credo-ts/didcomm").DiscoverFeaturesModule;
        mediationRecipient: import("@credo-ts/didcomm").MediationRecipientModule;
        messagePickup: import("@credo-ts/didcomm").MessagePickupModule<import("@credo-ts/didcomm").DefaultMessagePickupProtocols>;
        basicMessages: import("@credo-ts/didcomm").BasicMessagesModule;
        didcomm: import("@credo-ts/didcomm").DidCommModule;
        oob: import("@credo-ts/didcomm").OutOfBandModule;
        askar: CustomAskarModule;
        tenants: TenantsModule<import("@credo-ts/core").EmptyModuleMap>;
    }>;
}>;
