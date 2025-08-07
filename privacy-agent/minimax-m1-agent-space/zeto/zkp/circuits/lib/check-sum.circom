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
pragma circom 2.2.2;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

// CheckSum is a circuit that checks that the sum of input values equals the sum of output values
//
template CheckSum(nInputs, nOutputs) {
  signal input inputValues[nInputs];
  signal input outputValues[nOutputs];

  // check that the sum of input values equals the sum of output values
  var sumInputs = 0;
  for (var i = 0; i < nInputs; i++) {
    sumInputs = sumInputs + inputValues[i];
  }
  var sumOutputs = 0;
  for (var i = 0; i < nOutputs; i++) {
    sumOutputs = sumOutputs + outputValues[i];
  }

  var isSumEqual;
  isSumEqual = IsEqual()(in <== [sumInputs, sumOutputs]);

  isSumEqual === 1;
}