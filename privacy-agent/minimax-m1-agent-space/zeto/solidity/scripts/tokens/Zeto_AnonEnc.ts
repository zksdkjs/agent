// Copyright © 2024 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ethers, ignition } from "hardhat";
import zetoModule from "../../ignition/modules/zeto_anon_enc";

export async function deployDependencies() {
  const [deployer] = await ethers.getSigners();

  const {
    depositVerifier,
    withdrawVerifier,
    verifier,
    batchVerifier,
    batchWithdrawVerifier,
  } = await ignition.deploy(zetoModule);
  return {
    deployer,
    args: [
      "Zeto Anon Enc",
      "ZAE",
      await deployer.getAddress(),
      {
        verifier: verifier.target,
        depositVerifier: depositVerifier.target,
        withdrawVerifier: withdrawVerifier.target,
        batchVerifier: batchVerifier.target,
        batchWithdrawVerifier: batchWithdrawVerifier.target,
        lockVerifier: "0x0000000000000000000000000000000000000000",
        batchLockVerifier: "0x0000000000000000000000000000000000000000",
        burnVerifier: "0x0000000000000000000000000000000000000000",
        batchBurnVerifier: "0x0000000000000000000000000000000000000000",
      },
    ],
  };
}
