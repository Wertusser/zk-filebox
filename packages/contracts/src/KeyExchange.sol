// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract KeyExchange {
    struct KeyRequest {
        bytes32 keyCommitment;
        // bytes32 sharedKeyHash;
        bytes32[2] buyerPub;
        uint256 deadline;
        uint256 nonce;
    }

    struct KeyResponse {
        bytes32[4] encryptedKey;
    }

    uint256 public number;
    address public paymentToken;

    constructor(address payment) {
        paymentToken = payment;
    }

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
