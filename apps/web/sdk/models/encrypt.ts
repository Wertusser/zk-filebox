import {
  decrypt_packetInputType,
  decrypt_packet_circuit,
  encrypt_packetInputType,
  encrypt_packet_circuit,
  get_key_commitmentInputType,
  get_key_commitment_circuit,
} from "../generated/index.js";
import {
  generateWitness,
  ReturnWithWitness,
  verifyProofData,
} from "../utils/proof-utils.js";
import { bigintToField, Field, FieldSchema } from "../utils/field.js";
import {
  BYTES_PER_FIELD,
  DataBlob,
  dataBlobToFields,
  FIELDS_PER_DATA_BLOB,
} from "./data-blobs.js";
import z from "zod";
import { Hex, pad } from "viem";
import { Bytes } from "../utils/common.js";
import { deriveBigInt } from "../utils/random.js";

export const EncryptedDataBlobSchema = z.object({
  keyCommitment: FieldSchema,
  data: z.array(FieldSchema).length(FIELDS_PER_DATA_BLOB + 1),
  nonce: FieldSchema,
});

export function deterministicNonce(seed: bigint | Hex, path: string): Field {
  const val =
    deriveBigInt(seed, path) % BigInt(0x100000000000000000000000000000000);
  
  return bigintToField(val);
}

export type EncryptedDataBlob = z.infer<typeof EncryptedDataBlobSchema>;

export type GetKeyCommitmentArgs = {
  key: Field[];
  salt: Field;
};

export async function getKeyCommitment({
  key,
  salt,
}: GetKeyCommitmentArgs): Promise<ReturnWithWitness<Field>> {
  return generateWitness<get_key_commitmentInputType, Field>(
    get_key_commitment_circuit,
    { key, salt }
  );
}

export type EncryptArgs = {
  blob: DataBlob;
  key: Field[];
  nonce: Field;
  salt: Field;
};

export async function encryptBlob({
  key,
  blob,
  nonce,
  salt,
}: EncryptArgs): Promise<ReturnWithWitness<EncryptedDataBlob>> {
  const { output: keyCommitment } = await getKeyCommitment({ key, salt });

  const {
    output: felts,
    witness,
    bytecode,
  } = await generateWitness<encrypt_packetInputType, Field[]>(
    encrypt_packet_circuit,
    {
      key_commit: keyCommitment,
      plains: dataBlobToFields.encode(blob),
      nonce: nonce,
      salt: salt,
      key: key,
    }
  );

  return {
    output: {
      data: felts,
      nonce,
      keyCommitment,
    },
    witness,
    bytecode,
  };
}

export type DecryptArgs = {
  encryptedBlob: EncryptedDataBlob;
  key: Field[];
};

export async function decryptBlob({
  key,
  encryptedBlob,
}: DecryptArgs): Promise<ReturnWithWitness<DataBlob>> {
  const { output, witness, bytecode } = await generateWitness<
    decrypt_packetInputType,
    Field[]
  >(decrypt_packet_circuit, {
    ciphers: encryptedBlob.data,
    nonce: encryptedBlob.nonce,
    key,
  });

  const felts = output.map((field) => pad(field, { size: BYTES_PER_FIELD }));

  return {
    output: dataBlobToFields.decode(felts),
    witness,
    bytecode,
  };
}

export type VerifyBlobArgs = {
  proof: Bytes;
  encryptedBlob: EncryptedDataBlob;
};

export async function verifyBlob({
  proof,
  encryptedBlob,
}: VerifyBlobArgs): Promise<boolean> {
  return verifyProofData(
    {
      proof: proof,
      publicInputs: [
        encryptedBlob.keyCommitment,
        encryptedBlob.nonce,
        ...encryptedBlob.data,
      ],
    },
    encrypt_packet_circuit.bytecode
  );
}
