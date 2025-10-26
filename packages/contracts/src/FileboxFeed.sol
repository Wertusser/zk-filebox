// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {RequestKeysVerifier} from "./verifiers/RequestKeysVerifier.sol";

contract FileboxFeed {
    RequestKeysVerifier verifier;

    constructor() {
        verifier = new RequestKeysVerifier();
    }

    function verify(uint256 a, uint256 c, bytes calldata proof) public {
        bytes32[] memory pubInputs = new bytes32[](2);
        pubInputs[0] = bytes32(a);
        pubInputs[1] = bytes32(c);
        verifier.verify(proof, pubInputs);
    }
}
