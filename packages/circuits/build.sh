#!/usr/bin/env bash
cd "$(dirname "$0")"

rm -rf ./target
rm -rf ./export
rm -rf ./generated

nargo check
nargo compile --pedantic-solving --count-array-copies
nargo export

find ./target -type f -name "*.json" | while read -r filepath; do
  FILENAME=$(echo "$filepath" | sed -r "s/.+\/(.+)\..+/\1/")
  echo "\nCircuit: $FILENAME"
  
  bb gates -b "$filepath" | jq '.functions[0] | {acir_opcodes: .acir_opcodes, circuit_size: .circuit_size}'
  bb write_vk -b "$filepath" -o ./target --oracle_hash keccak
  bb write_solidity_verifier -k ./target/vk -o ./target/${FILENAME}.sol
  rm -rf ./target/vk
done

cp -r ./export/* ./target
rm -rf ./export