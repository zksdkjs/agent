import { jest } from '@jest/globals';

export const createLogger = () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
});

export const createAztecNodeClient = (url: string) => ({
  endpoint: url,
});

export class PXE {
  constructor(public endpoint: string = '') {}

  static async create() {
    return new PXE();
  }
}

export class Fr {
  static fromString(value: string) {
    return value;
  }

  static random() {
    return 'random-fr';
  }
}

export class AztecAddress {
  private constructor(private value: string) {}

  static fromString(value: string) {
    return new AztecAddress(value);
  }

  toString() {
    return this.value;
  }
}

export enum TxStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export class TxHash {
  static random() {
    return new TxHash('0xmocked');
  }

  constructor(private value: string) {}

  toString() {
    return this.value;
  }
}

export type ContractArtifact = Record<string, unknown>;

export class Contract {
  static deploy(_wallet: unknown, _artifact: unknown, _args: unknown[]) {
    return {
      send: () => ({
        deployed: async () => new Contract(),
      }),
    };
  }

  static async at(_address: unknown, _artifact: unknown, _wallet: unknown) {
    return new Contract();
  }

  methods: Record<string, (...args: unknown[]) => any> = new Proxy(
    {},
    {
      get: () => () => ({
        send: () => ({
          wait: async () => ({
            status: 'success',
            txHash: {
              toString: () => '0xmocked-tx',
            },
          }),
        }),
        simulate: async () => 0,
      }),
    },
  );
}

export class AccountWallet {
  constructor(private value: string = '0xwallet') {}

  getAddress() {
    return AztecAddress.fromString(this.value);
  }
}

export class CompleteAddress {
  public publicKeys = {
    hash: () => ({
      toString: () => 'aztec-public-key-hash',
    }),
  };
}

export class DeployMethod {}

export class AztecNode {}
