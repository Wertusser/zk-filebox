import {
  derive_public_keyInputType,
  derive_public_key_circuit,
  derive_shared_keyInputType,
  derive_shared_key_circuit,
} from "../generated/index"
import { generateWitness } from "../utils/proof-utils";
import { Field } from "../utils/field";
import { deriveField, randomField } from "../utils/random";
import { Hex } from "viem";

export type EphemernalPublicKey = [Field, Field];

export class EphemernalKeypair {
  private privateKey: Field;

  constructor(privateKey: Field) {
    this.privateKey = privateKey;
  }

  static random() {
    return new EphemernalKeypair(randomField());
  }

  static derive(seed: bigint | Hex, path: string = "") {
    return new EphemernalKeypair(deriveField(seed, path));
  }

  async publicKey(): Promise<EphemernalPublicKey> {
    const publicKey = await derivePublicKey(this.privateKey);
    return publicKey as EphemernalPublicKey;
  }

  async sharedKey(publicKey: EphemernalPublicKey): Promise<Field> {
    const sharedKey = await deriveSharedKey(this.privateKey, publicKey);
    return sharedKey as Field;
  }
}

export async function derivePublicKey(private_key: Field): Promise<Field[]> {
  const { output } = await generateWitness<derive_public_keyInputType, Field[]>(
    derive_public_key_circuit,
    { private_key }
  );
  return output;
}

export async function deriveSharedKey(
  private_key: Field,
  public_key_packed: Field[]
): Promise<Field> {
  const { output } = await generateWitness<derive_shared_keyInputType, Field>(
    derive_shared_key_circuit,
    { private_key, public_key_packed }
  );
  return output;
}
