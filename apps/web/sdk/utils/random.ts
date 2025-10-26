import { hkdf } from "@noble/hashes/hkdf";
import { sha256 } from "@noble/hashes/sha2";
import { randomBytes as _randomBytesSecure } from "@noble/hashes/utils";
import { bytesToBigInt, keccak256, toBytes, toHex, type Hex } from "viem";
import { bigintToField, BN254_MODULUS, Field } from "./field";
import { Bytes } from "./common";

export const DEFAULT_SALT = toBytes(keccak256(toHex("DEFAULT_SALT")));

export function deriveBigInt(seed: bigint | Hex, path: string): bigint {
  const output = hkdf(sha256, toBytes(seed), DEFAULT_SALT, path, 32);
  return bytesToBigInt(output);
}

export function deriveField(
  seed: bigint | Hex,
  path: string,
  fn: (val: bigint) => bigint = (x) => x
): Field {
  return bigintToField(fn(deriveBigInt(seed, path)) % BN254_MODULUS);
}

export function deriveNonce(seed: bigint | Hex, path: string): Field {
  return deriveField(
    seed,
    path,
    (x) => x % BigInt(0x100000000000000000000000000000000)
  );
}

export function randomBytes(size: number): Bytes {
  if (size <= 65536) return new Uint8Array(_randomBytesSecure(size));

  // Calculate number of full chunks and remaining bytes
  const numChunks = Math.floor(size / 65536);
  const remainingBytes = size % 65536;

  // Create result array
  const result = new Uint8Array(size);

  // Fill full chunks
  for (let i = 0; i < numChunks; i++) {
    const chunk = new Uint8Array(_randomBytesSecure(65536));
    result.set(chunk, i * 65536);
  }

  // Fill remaining bytes if any
  if (remainingBytes > 0) {
    const lastChunk = new Uint8Array(_randomBytesSecure(remainingBytes));
    result.set(lastChunk, numChunks * 65536);
  }

  return result;
}

export function randomBigInt(): bigint {
  const seed = randomBytes(32);
  return bytesToBigInt(seed);
}

export function randomHex(size: number = 32): Hex {
  return toHex(randomBytes(size));
}

export function randomField(): Field {
  return bigintToField(randomBigInt() % BN254_MODULUS);
}
