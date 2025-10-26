import { hkdf } from "@noble/hashes/hkdf";
import { sha256 } from "@noble/hashes/sha2";
import { randomBytes as _randomBytesSecure } from "@noble/hashes/utils";
import { bytesToBigInt, keccak256, toBytes, toHex, type Hex } from "viem";
import { isHex } from "viem";
import z from "zod";

export const BytesSchema = z.instanceof(Uint8Array<ArrayBuffer>);
export type Bytes = Uint8Array<ArrayBuffer>;

export const HexSchema = z.custom<Hex>((val) => isHex(val), {
  message: "Invalid hex string",
});
