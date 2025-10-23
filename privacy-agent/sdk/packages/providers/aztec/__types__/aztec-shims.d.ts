declare module '@aztec/accounts/schnorr' {
  import { PXE, Fr, AccountWallet } from '@aztec/aztec.js';
  
  export function getSchnorrAccount(pxe: PXE, signingKey: Fr): Promise<{
    getWallet(): AccountWallet;
    getCompleteAddress(): Promise<any>;
  }>;
}

declare module '@aztec/stdlib/keys' {
  import { Fr } from '@aztec/aztec.js';
  
  export function deriveSigningKey(mnemonic: string, index: number): Fr;
}
