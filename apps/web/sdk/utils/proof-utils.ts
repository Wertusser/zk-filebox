import z from "zod";
import { CompiledCircuit, InputMap, Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@aztec/bb.js";
import { Bytes, BytesSchema } from "./common.js";
import { FieldSchema } from "./field.js";

export type ReturnWithWitness<T> = {
  output: T;
  witness: Bytes;
  bytecode: string;
};

export const ProofDataSchema = z.object({
  proof: BytesSchema,
  publicInputs: z.array(FieldSchema),
});

export type ProofData = z.infer<typeof ProofDataSchema>;

export async function generateWitness<I extends InputMap, O>(
  circuit: CompiledCircuit,
  args: I
): Promise<ReturnWithWitness<O>> {
  const program = new Noir(circuit);
  const { returnValue, witness } = await program.execute(args);
  const output = returnValue as O;

  return {
    output,
    witness: new Uint8Array(witness),
    bytecode: circuit.bytecode,
  };
}

export async function generateProofData<T>(
  inputs: ReturnWithWitness<T>
): Promise<ProofData> {
  const backend = new UltraHonkBackend(inputs.bytecode);
  const proofData = await backend.generateProof(inputs.witness);
  return ProofDataSchema.parse(proofData);
}

export async function generateProof<T>(
  inputs: ReturnWithWitness<T>
): Promise<Bytes> {
  const { proof } = await generateProofData(inputs);
  return proof;
}

export async function verifyProofData(
  proof: ProofData,
  bytecode: CompiledCircuit["bytecode"]
): Promise<boolean> {
  const backend = new UltraHonkBackend(bytecode);
  return backend.verifyProof(proof);
}
