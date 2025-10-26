import { describe, expect, it } from "vitest";
import { bigintToField, Field } from "../../utils/field"
import {
  DecryptArgs,
  EncryptArgs,
  encryptBlob,
  decryptBlob,
  deterministicNonce,
  verifyBlob,
} from "../encrypt";
import {
  bytesToDataBlobs,
  DataBlob,
  MAX_DATA_BLOB_SIZE,
} from "../data-blobs";
import { keccak256 } from "viem";
import { generateProof } from "../../utils/proof-utils";
import { randomBigInt, randomBytes, randomField } from "../../utils/random";

describe("Encryption and Decryption", () => {
  // Helper function to create a sample DataBlob
  function createSampleDataBlob(): DataBlob {
    const bytes = new Uint8Array(randomBytes(MAX_DATA_BLOB_SIZE / 2 + 1));
    return bytesToDataBlobs.encode(bytes)[0];
  }

  // Helper function to create encryption arguments
  async function createEncryptArgs(blob: DataBlob): Promise<EncryptArgs> {
    const key = [randomField(), randomField()];
    const salt = randomField();

    const nonce = deterministicNonce(randomField(), "nonce");

    return {
      blob,
      salt,
      key,
      nonce,
    };
  }

  describe("encryptBlob", () => {
    it("should encrypt a blob and return valid encrypted data", async () => {
      const testBlob = createSampleDataBlob();
      const args = await createEncryptArgs(testBlob);
      const result = await encryptBlob(args);

      // Check the structure of the result
      expect(result).toHaveProperty("output");
      expect(result).toHaveProperty("witness");
      expect(result).toHaveProperty("bytecode");

      // Verify the encrypted blob structure
      const encryptedBlob = result.output;
      expect(encryptedBlob).toHaveProperty("data");
      expect(encryptedBlob).toHaveProperty("nonce");
      expect(encryptedBlob.nonce).toBe(args.nonce);

      // Verify data array length
      expect(Array.isArray(encryptedBlob.data)).toBe(true);
      expect(encryptedBlob.data.length).toBeGreaterThan(0);

      // Verify each field in data is a valid hex string
      encryptedBlob.data.forEach((field: Field) => {
        expect(typeof field).toBe("string");
        expect(field.startsWith("0x")).toBe(true);
      });
    });

    it("should produce different ciphertexts for same data with different nonces", async () => {
      const testBlob = createSampleDataBlob();
      const args1 = await createEncryptArgs(testBlob);

      const nonce = bigintToField(
        randomBigInt() % BigInt(0x100000000000000000000000000000000)
      );
      const args2 = { ...args1, nonce }; // Same data, different nonce

      const result1 = await encryptBlob(args1);
      const result2 = await encryptBlob(args2);

      // Verify different nonces produced different ciphertexts
      expect(result1.output.data).not.toEqual(result2.output.data);
    });
  });

  describe("verifyBlob", () => {
    it("should successfully verify an encrypted blob", async () => {
      // First encrypt some data
      const originalBlob = createSampleDataBlob();
      const encryptArgs = await createEncryptArgs(originalBlob);
      const witness = await encryptBlob(encryptArgs);
      const proof = await generateProof(witness);

      // Verify the proof
      const isValid = await verifyBlob({
        encryptedBlob: witness.output,
        proof: proof,
      });

      expect(isValid).toBe(true);
    });
  });

  describe("decryptBlob", () => {
    it("should successfully decrypt an encrypted blob", async () => {
      // First encrypt some data
      const originalBlob = createSampleDataBlob();
      const encryptArgs = await createEncryptArgs(originalBlob);
      const encryptResult = await encryptBlob(encryptArgs);

      // Then decrypt it
      const decryptArgs: DecryptArgs = {
        key: encryptArgs.key,
        encryptedBlob: encryptResult.output,
      };

      const decryptResult = await decryptBlob(decryptArgs);

      // Verify the decrypted result
      expect(decryptResult).toHaveProperty("output");
      expect(decryptResult).toHaveProperty("witness");
      expect(decryptResult).toHaveProperty("bytecode");

      // Compare the decrypted data with original
      expect(keccak256(decryptResult.output)).toBe(keccak256(originalBlob));
    });

    it("should fail to decrypt with wrong key", async () => {
      // First encrypt some data
      const originalBlob = createSampleDataBlob();
      const encryptArgs = await createEncryptArgs(originalBlob);
      const encryptResult = await encryptBlob(encryptArgs);

      // Try to decrypt with wrong key
      const wrongKey = [randomField(), randomField()];
      const decryptArgs: DecryptArgs = {
        key: wrongKey,
        encryptedBlob: encryptResult.output,
      };

      // Attempt to decrypt with wrong key should either throw or produce different output
      await expect(() => decryptBlob(decryptArgs)).rejects.toThrow(
        "Cannot satisfy constraint"
      );
    });
  });

  describe("End-to-end encryption workflow", () => {
    it("should preserve data integrity through encrypt-decrypt cycle", async () => {
      for (let i = 0; i < 16; i++) {
        const originalBlob = createSampleDataBlob();

        // Encrypt
        const encryptArgs = await createEncryptArgs(originalBlob);
        const encrypted = await encryptBlob(encryptArgs);

        // Decrypt
        const decrypted = await decryptBlob({
          key: encryptArgs.key,
          encryptedBlob: encrypted.output,
        });

        // Verify
        expect(keccak256(decrypted.output)).toBe(keccak256(originalBlob));
      }
    });

    it("should handle edge cases in data", async () => {
      // Test with empty data
      const emptyBlob = new Uint8Array(MAX_DATA_BLOB_SIZE); // MAX_DATA_BLOB_SIZE bytes of zeros
      const encryptArgs = await createEncryptArgs(emptyBlob);
      const encrypted = await encryptBlob(encryptArgs);
      const decrypted = await decryptBlob({
        key: encryptArgs.key,
        encryptedBlob: encrypted.output,
      });

      expect(keccak256(decrypted.output)).toBe(keccak256(emptyBlob));

      // Test with all bytes set to maximum value
      const maxBlob = new Uint8Array(MAX_DATA_BLOB_SIZE).fill(255);
      const encryptArgs2 = await createEncryptArgs(maxBlob);
      const encrypted2 = await encryptBlob(encryptArgs2);
      const decrypted2 = await decryptBlob({
        key: encryptArgs2.key,
        encryptedBlob: encrypted2.output,
      });

      expect(keccak256(decrypted2.output)).toBe(keccak256(maxBlob));
    });
  });
});
