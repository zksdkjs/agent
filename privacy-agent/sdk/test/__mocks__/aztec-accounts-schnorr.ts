import { jest } from '@jest/globals';

export const getSchnorrAccount = jest.fn(async () => {
  const wallet = {
    getAddress: () => ({
      toString: () => 'aztec-wallet-address',
    }),
  };

  return {
    getWallet: () => wallet,
    getCompleteAddress: async () => ({
      publicKeys: {
        hash: () => ({
          toString: () => 'aztec-public-key-hash',
        }),
      },
    }),
  };
});
