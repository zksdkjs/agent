export enum NetworkName {
  Ethereum = 'ethereum',
  Polygon = 'polygon',
  Arbitrum = 'arbitrum',
}

export enum ProofType {
  Deposit = 'deposit',
  Transfer = 'transfer',
  Withdraw = 'withdraw',
}

export type TransactionTokenAmount = Record<string, unknown>;
export type TransactionGasDetails = Record<string, unknown>;

export class RailgunEngine {
  constructor(
    _dbPath: string,
    _rpcEndpoints: Record<string, string>,
    _proxySettings?: unknown,
    _shouldDebug?: boolean,
    _wasmPath?: string,
    _wasmBundled?: boolean,
  ) {}
}

export class RailgunWallet {
  static async fromMnemonic(
    _engine: RailgunEngine,
    _mnemonic: string,
    _derivationIndex?: number,
    _isViewOnly?: boolean,
  ) {
    return new RailgunWallet();
  }
}

export class RailgunTransaction {}
