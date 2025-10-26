import { describe, expect, it } from "vitest";
import {
  bytesToBundle,
  encryptBundle,
  decryptBundle,
  getBundleSecrets,
  verifyBundle,
} from "../bundle";
import { keccak256, toHex } from "viem";
import { randomBytes } from "../../utils/random";

describe.skip("Bundle Operations", () => {
  describe("bytesToBundle", () => {
    it("should convert bytes to bundle with correct structure", () => {
      const testData = randomBytes(1024); // 1KB test data
      const bundle = bytesToBundle.encode(new Uint8Array(testData));

      // Verify structure
      expect(bundle).toHaveProperty("dataHash");
      expect(bundle).toHaveProperty("blobs");
      expect(Array.isArray(bundle.blobs)).toBe(true);

      // Verify data hash
      expect(bundle.dataHash).toBe(keccak256(testData));
    });

    it("should handle large data correctly", () => {
      const size = 1024 * 100; // 100KB
      const largeData = randomBytes(size);
      const bundle = bytesToBundle.encode(new Uint8Array(largeData));

      // Convert back and verify
      const recovered = bytesToBundle.decode(bundle);
      expect(toHex(recovered)).toBe(toHex(largeData));
    });

    it("should maintain data integrity through encode-decode cycle", () => {
      const testSizes = [1024, 10240, 102400]; // Test different sizes

      for (const size of testSizes) {
        const originalData = randomBytes(size);
        const bundle = bytesToBundle.encode(new Uint8Array(originalData));
        const recovered = bytesToBundle.decode(bundle);

        expect(toHex(recovered)).toBe(toHex(originalData));
      }
    });
  });

  describe("Bundle Encryption and Decryption", () => {
    it("should successfully encrypt and decrypt a bundle", async () => {
      const testData = randomBytes(1024);
      const bundle = bytesToBundle.encode(new Uint8Array(testData));
      const seed = BigInt(123456789);

      // Encrypt
      const encryptedBundle = await encryptBundle({ bundle, seed });

      // Verify encrypted structure
      expect(encryptedBundle).toHaveProperty("keyCommitment");
      expect(encryptedBundle).toHaveProperty("blobs");
      expect(Array.isArray(encryptedBundle.blobs)).toBe(true);

      // Get secrets for decryption
      const { key } = getBundleSecrets(bundle, seed);

      // Decrypt
      const decryptedBundle = await decryptBundle({
        encryptedBundle,
        key,
      });

      // Convert back to bytes and verify
      const recoveredData = bytesToBundle.decode(decryptedBundle);
      expect(toHex(recoveredData)).toBe(toHex(testData));
    });

    it("should handle parallel encryption of large bundles", async () => {
      const testData = randomBytes(1024 * 100); // 100KB
      const bundle = bytesToBundle.encode(new Uint8Array(testData));
      const seed = BigInt(123456789);

      // Encrypt
      const encryptedBundle = await encryptBundle({ bundle, seed });
      const { key } = getBundleSecrets(bundle, seed);

      // Decrypt
      const decryptedBundle = await decryptBundle({
        encryptedBundle,
        key,
      });

      // Verify
      const recoveredData = bytesToBundle.decode(decryptedBundle);
      expect(toHex(recoveredData)).toBe(toHex(testData));
    });

    it("should fail to decrypt with wrong key", async () => {
      const testData = randomBytes(1024);
      const bundle = bytesToBundle.encode(new Uint8Array(testData));
      const seed = BigInt(123456789);

      // Encrypt
      const encryptedBundle = await encryptBundle({ bundle, seed });

      // Try to decrypt with wrong key
      const wrongKey = [
        "0x0123456789abcdef0123456789abcdef",
        "0x0987654321fedcba0987654321fedcba",
      ] as [`0x${string}`, `0x${string}`];

      // Attempt to decrypt should fail
      await expect(
        decryptBundle({
          encryptedBundle,
          key: wrongKey,
        })
      ).rejects.toThrow();
    });

    it("should succeed in verifying a valid encrypted bundle", async () => {
      const testData = randomBytes(1024);
      const bundle = bytesToBundle.encode(new Uint8Array(testData));
      const seed = BigInt(123456789);

      const isValid = await verifyBundle(await encryptBundle({ bundle, seed }));
      expect(isValid).toBe(true);
    });
  });

  describe("getBundleSecrets", () => {
    it("should generate consistent secrets for same input", () => {
      const testData = randomBytes(1024);
      const bundle = bytesToBundle.encode(new Uint8Array(testData));
      const seed = BigInt(123456789);

      const secrets1 = getBundleSecrets(bundle, seed);
      const secrets2 = getBundleSecrets(bundle, seed);

      expect(secrets1.key).toEqual(secrets2.key);
      expect(secrets1.salt).toEqual(secrets2.salt);
      expect(secrets1.nonces).toEqual(secrets2.nonces);
    });

    it("should generate different secrets for different bundles", () => {
      const data1 = randomBytes(1024);
      const data2 = randomBytes(2048);
      const bundle1 = bytesToBundle.encode(new Uint8Array(data1));
      const bundle2 = bytesToBundle.encode(new Uint8Array(data2));
      const seed = BigInt(123456789);

      const secrets1 = getBundleSecrets(bundle1, seed);
      const secrets2 = getBundleSecrets(bundle2, seed);

      // At least one of the secrets should be different
      const allEqual =
        secrets1.key[0] === secrets2.key[0] &&
        secrets1.key[1] === secrets2.key[1] &&
        secrets1.salt === secrets2.salt &&
        JSON.stringify(secrets1.nonces) === JSON.stringify(secrets2.nonces);

      expect(allEqual).toBe(false);
    });
  });
});
