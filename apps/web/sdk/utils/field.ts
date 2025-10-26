import { fromHex, Hex, toHex } from "viem";
import { HexSchema } from "./common.js";
import z from "zod";

export const BN254_MODULUS =
  BigInt(0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001);

export const FieldSchema = HexSchema.refine(
  (value) => {
    const val = fromHex(value, "bigint");
    return val < BN254_MODULUS && val >= BigInt(0);
  },
  {
    message: "Not a field",
  }
);

export type Field = z.infer<typeof FieldSchema>;

export function isField(value: Hex | bigint): value is Field {
  return FieldSchema.safeParse(value).success;
}

export function hexToField(value: Hex): Field {
  const parsed = FieldSchema.parse(value);
  return parsed;
}

export function bigintToField(value: bigint): Field {
  return hexToField(toHex(value));
}
