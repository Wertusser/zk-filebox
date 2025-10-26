// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {KeyExchange} from "../src/KeyExchange.sol";

contract KeyExchangeScript is Script {
    KeyExchange public KeyExchange;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        KeyExchange = new KeyExchange();

        vm.stopBroadcast();
    }
}
