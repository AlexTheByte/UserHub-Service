import { registerAs } from '@nestjs/config';

export interface IRpcReferencesConfig {
  host: string;
  port: number;
}

export const RpcReferencesConfiguration = registerAs('rpc-references', () => ({
  host: process.env.RPC_REFERENCES_HOST,
  port: parseInt(process.env.RPC_REFERENCES_PORT),
}));
