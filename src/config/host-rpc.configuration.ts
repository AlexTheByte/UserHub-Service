import { registerAs } from '@nestjs/config';

export interface IHostRpcConfig {
  port: number;
}

export const HostRpcConfiguration = registerAs('host-rpc', () => ({
  port: parseInt(process.env.HOST_RPC_PORT),
}));
