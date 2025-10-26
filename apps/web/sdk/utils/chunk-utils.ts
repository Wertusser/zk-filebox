import { bytesToHex, concat, toBytes } from "viem";
import { Field, hexToField } from "./field.js";
import { Bytes } from "./common.js";

export function chunk<T>(arr: T[], chunkLength: number): T[][] {
  if (chunkLength <= 0) throw new Error("chunkLength must be greater than 0");

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkLength) {
    result.push(arr.slice(i, i + chunkLength));
  }
  return result;
}

export function chunkBytes(bytes: Bytes, chunkByteLength: number): Bytes[] {
  return chunk([...bytes], chunkByteLength).map(
    (chunk) => new Uint8Array(chunk)
  );
}

export function chunkBytesByFields(
  bytes: Bytes,
  fieldByteSize: number
): Field[] {
  const fields: Field[] = [];
  const chunks = chunkBytes(bytes, fieldByteSize);

  for (const chunk of chunks) {
    const val = bytesToHex(chunk, { size: fieldByteSize });
    fields.push(hexToField(val));
  }

  return fields;
}

export function concatFields(felts: Field[], fieldByteSize: number): Bytes {
  const bytes = felts.map((field) => toBytes(field, { size: fieldByteSize }));
  return new Uint8Array(concat(bytes));
}
