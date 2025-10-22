use poseidon::poseidon2::Poseidon2;

#[field(bn254)]
pub fn poseidon2_hash<let N: u32>(value: [Field; N]) -> Field {
    Poseidon2::hash(value, N)
}

#[field(bn254)]
pub fn commit<let N: u32>(value: [Field; N], salt: Field) -> Field {
    let mut nullifier_preimage = [0; N + 1];
    for i in 0..N {
        nullifier_preimage[i] = value[i];
    }
    nullifier_preimage[N] = salt;
    poseidon2_hash(nullifier_preimage)
}
