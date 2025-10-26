// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {KeyExchange} from "../src/KeyExchange.sol";

contract KeyExchangeScript is Script {
    KeyExchange public KeyExchange;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        address payment = address(0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9); // PYUSD

        KeyExchange = new KeyExchange(payment);

        vm.stopBroadcast();
    }
}
