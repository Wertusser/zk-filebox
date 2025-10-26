use poseidon::poseidon2::Poseidon2;

#[field(bn254)]
pub fn poseidon2_hash<let N: u32>(value: [Field; N]) -> Field {
    Poseidon2::hash(value, N)
}
