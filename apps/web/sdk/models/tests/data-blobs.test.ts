import { test } from "vitest";
import {
  dataBlobToFields,
  bytesToDataBlobs,
  MAX_DATA_BLOB_SIZE,
} from "../data-blobs";
import { toHex } from "viem";
import { randomBytes } from "../../utils/random";

test("blobs <> bytes conversion", ({ expect }) => {
  for (let i = 0; i < 128; i++) {
    const byteSize = MAX_DATA_BLOB_SIZE * 2 + 1;
    const totalBlobs = Math.ceil(byteSize / MAX_DATA_BLOB_SIZE);

    const bytes = new Uint8Array(randomBytes(byteSize));
    const blobs = bytesToDataBlobs.encode(bytes);

    expect(blobs.length).toBe(totalBlobs);

    const recovered = bytesToDataBlobs.decode(blobs);
    expect(toHex(recovered)).toBe(toHex(bytes));
  }
});

test("bytesToBlobs codec should work with zero-padded data", ({ expect }) => {
  for (let i = 0; i < 128; i++) {
    const byteSize = MAX_DATA_BLOB_SIZE * 2 + 1;
    const totalBlobs = Math.ceil(byteSize / MAX_DATA_BLOB_SIZE);

    const bytes = new Uint8Array([
      0,
      0,
      0,
      0,
      0,
      ...randomBytes(byteSize),
      0,
      0,
      0,
      0,
      0,
    ]);
    const blobs = bytesToDataBlobs.encode(bytes);

    expect(blobs.length).toBe(totalBlobs);

    const recovered = bytesToDataBlobs.decode(blobs);
    expect(toHex(recovered)).toBe(toHex(bytes));
  }
});

test("bytesToBlobs codec should work with zero-padded data", ({ expect }) => {
  const bytes = new Uint8Array(MAX_DATA_BLOB_SIZE - 4).fill(0);
  const blobs = bytesToDataBlobs.encode(bytes);

  expect(blobs.length).toBe(1);

  const recovered = bytesToDataBlobs.decode(blobs);
  expect(toHex(recovered)).toBe(toHex(bytes));
});

test("dataBlobToFields.decode throws error for invalid fields", ({
  expect,
}) => {
  // Create a valid blob first
  const bytes = new Uint8Array(randomBytes(MAX_DATA_BLOB_SIZE / 2));
  const [blob] = bytesToDataBlobs.encode(bytes);
  const fields = dataBlobToFields.encode(blob);

  // Insert an invalid field (a value >= BN254_MODULUS)
  const invalidFields = [...fields];
  invalidFields[0] =
    "0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001"; // BN254_MODULUS

  // Verify that decode throws an error
  expect(() => dataBlobToFields.decode(invalidFields)).toThrow("Not a field");
});
