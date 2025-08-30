import {
  RecipeERC20AmountRecipient,
  RecipeERC20Info,
  StepConfig,
  StepInput,
  StepOutputERC20Amount,
  UnvalidatedStepOutput,
} from '../../../models/export-models';
import { compareERC20Info } from '../../../utils/token';
import { Step } from '../../step';
import { BEEFY_VAULT_ERC20_DECIMALS, BeefyVaultData } from '../../../api/beefy';
import { BeefyVaultContract } from '../../../contract/vault/beefy/beefy-vault-contract';
import { calculateOutputsForBeefyWithdraw } from './beefy-util';

export class BeefyWithdrawStep extends Step {
  readonly config: StepConfig = {
    name: 'Beefy Vault Withdraw',
    description: 'Withdraws from a yield-bearing Beefy Vault.',
  };

  private readonly vault: BeefyVaultData;

  constructor(vault: BeefyVaultData) {
    super();
    this.vault = vault;
  }

  protected async getStepOutput(
    input: StepInput,
  ): Promise<UnvalidatedStepOutput> {
    const {
      vaultName,
      depositERC20Address,
      depositERC20Decimals,
      vaultContractAddress,
      vaultERC20Address,
    } = this.vault;
    const { erc20Amounts } = input;

    const withdrawERC20Info: RecipeERC20Info = {
      tokenAddress: vaultERC20Address,
      decimals: BEEFY_VAULT_ERC20_DECIMALS,
    };
    const { erc20AmountForStep, unusedERC20Amounts } =
      this.getValidInputERC20Amount(
        erc20Amounts,
        erc20Amount => compareERC20Info(erc20Amount, withdrawERC20Info),
        undefined, // amount
      );

    const contract = new BeefyVaultContract(vaultContractAddress);
    const crossContractCall = await contract.createWithdrawAll();

    const { withdrawFeeAmount, withdrawAmountAfterFee } =
      calculateOutputsForBeefyWithdraw(
        erc20AmountForStep.expectedBalance,
        this.vault,
      );

    const spentERC20AmountRecipient: RecipeERC20AmountRecipient = {
      ...withdrawERC20Info,
      amount: erc20AmountForStep.expectedBalance,
      recipient: `${vaultName} Vault`,
    };
    const outputERC20Amount: StepOutputERC20Amount = {
      tokenAddress: depositERC20Address,
      decimals: depositERC20Decimals,
      expectedBalance: withdrawAmountAfterFee,
      minBalance: withdrawAmountAfterFee,
      approvedSpender: undefined,
    };
    const feeERC20AmountRecipients: RecipeERC20AmountRecipient[] =
      withdrawFeeAmount > 0n
        ? [
            {
              tokenAddress: depositERC20Address,
              decimals: depositERC20Decimals,
              amount: withdrawFeeAmount,
              recipient: `${vaultName} Vault Withdraw Fee`,
            },
          ]
        : [];

    return {
      crossContractCalls: [crossContractCall],
      spentERC20Amounts: [spentERC20AmountRecipient],
      outputERC20Amounts: [outputERC20Amount, ...unusedERC20Amounts],
      outputNFTs: input.nfts,
      feeERC20AmountRecipients,
    };
  }
}
