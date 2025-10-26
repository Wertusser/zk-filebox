import {
  EncryptedDataBlobSchema,
  decryptBlob,
  encryptBlob,
  verifyBlob,
} from "./encrypt.js";
import { bytesToDataBlobs, DataBlobSchema } from "./data-blobs.js";
import { Field, FieldSchema } from "../utils/field.js";
import { generateProof } from "../utils/proof-utils.js";
import { BytesSchema, HexSchema } from "../utils/common.js";
import { keccak256 } from "viem";
import z from "zod";
import { deriveField, deriveNonce } from "../utils/random.js";

export const BundleSchema = z.object({
  dataHash: HexSchema,
  blobs: z.array(DataBlobSchema),
});

export type Bundle = z.infer<typeof BundleSchema>;

export const EncryptedBundleSchema = z.object({
  keyCommitment: FieldSchema,
  blobs: z.array(
    z.object({
      data: EncryptedDataBlobSchema,
      proof: BytesSchema,
    })
  ),
});

export type EncryptedBundle = z.infer<typeof EncryptedBundleSchema>;

export const bytesToBundle = z.codec(BundleSchema, BytesSchema, {
  encode: (bytes) => {
    const dataHash = keccak256(bytes);
    const blobs = bytesToDataBlobs.encode(new Uint8Array(bytes));
    return { dataHash, blobs } satisfies Bundle;
  },
  decode: ({ blobs }) => {
    const bytesRaw = bytesToDataBlobs.decode(blobs);
    return new Uint8Array(bytesRaw);
  },
});

export function getBundleSecrets(bundle: Bundle, seed: bigint) {
  const dataHash = bundle.dataHash;
  return {
    key: [
      deriveField(seed, `${dataHash}/key/0`),
      deriveField(seed, `${dataHash}/key/1`),
    ],
    salt: deriveField(seed, `${dataHash}/salt`),
    nonces: bundle.blobs.map((_, i) =>
      deriveNonce(seed, `${dataHash}/nonce/${i}`)
    ),
  };
}

export type EncryptBundleArgs = {
  bundle: Bundle;
  seed: bigint;
};

export async function encryptBundle({
  bundle,
  seed,
}: EncryptBundleArgs): Promise<EncryptedBundle> {
  const { key, salt, nonces } = getBundleSecrets(bundle, seed);
  const witnessPromises = bundle.blobs.map((blob, i) => {
    return encryptBlob({ nonce: nonces[i], blob, key, salt });
  });
  const witnesses = await Promise.all(witnessPromises);

  const proofPromises = witnesses.map((witness) =>
    generateProof(witness).then((proof) => ({
      proof: proof,
      data: witness.output,
    }))
  );
  const encryptedBlobs = await Promise.all(proofPromises);

  return {
    keyCommitment: encryptedBlobs[0].data.keyCommitment,
    blobs: encryptedBlobs,
  } satisfies EncryptedBundle;
}

export type DecryptBundleArgs = {
  encryptedBundle: EncryptedBundle;
  key: Field[];
};

export async function decryptBundle({
  encryptedBundle,
  key,
}: DecryptBundleArgs): Promise<Bundle> {
  const decryptedBlobsPromises = encryptedBundle.blobs.map((blob) =>
    decryptBlob({
      encryptedBlob: blob.data,
      key,
    })
  );
  const decryptedBlobs = await Promise.all(decryptedBlobsPromises);
  const bytes = bytesToDataBlobs.decode(decryptedBlobs.map((b) => b.output));

  return bytesToBundle.encode(bytes);
}

export type VerifyBundleArgs = {
  bundle: Bundle;
  seed: bigint;
};

export async function verifyBundle(
  encryptedBundle: EncryptedBundle
): Promise<boolean> {
  const verifyPromises = encryptedBundle.blobs.map((blob) => {
    return verifyBlob({ proof: blob.proof, encryptedBlob: blob.data });
  });
  const verifies = await Promise.all(verifyPromises);
  return verifies.every((v) => v);
}
