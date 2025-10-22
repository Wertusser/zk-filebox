use noir_edwards::{ScalarField, bjj::BabyJubJub, Curve, CurveTrait};
use super::utils::poseidon2_hash;

// [8]G precalculated
global BASE8_POINT: [Field; 2] = [
    5299619240641551281634865583518297030282874472190772894086521144482721001553,
    16950150798460657717958625567821834550301663161624707787222815936182638968203,
];

/// ScalarField<63> enables cheap bitslice converions for scalar multipliers that must be <2^{252}
/// ScalarField<64> enables bitslice conversions for arbitrary field elements

#[field(bn254)]
pub fn derive_public_key(private_key: Field) -> [Field; 2] {
    let private_scalar: ScalarField<64> = ScalarField::from(private_key);
    let base8_point: BabyJubJub = Curve::new(BASE8_POINT[0], BASE8_POINT[1]);
    let point = base8_point.mul(private_scalar);
    [point.x, point.y]
}

#[field(bn254)]
pub fn derive_shared_key(private_key: Field, public_key_packed: [Field; 2]) -> Field {
    let private_scalar: ScalarField<64> = ScalarField::from(private_key);
    let point: BabyJubJub = Curve::new(public_key_packed[0], public_key_packed[1]);
    let shared_key = point.mul(private_scalar);
    shared_key.x
}

#[test]
fn test_e2e() {
    let a_key = poseidon2_hash([0]);
    let a_pubkey = derive_public_key(a_key);

    let b_key = poseidon2_hash([1]);
    let b_pubkey = derive_public_key(b_key);

    let key_1 = derive_shared_key(a_key, b_pubkey);
    let key_2 = derive_shared_key(b_key, a_pubkey);

    assert(key_1 == key_2);

    // println(f"Alice public key: {a_pubkey}");
    // println(f"Alice private key: {a_key}");
    // println("");
    // println(f"Bob public key: {b_pubkey}");
    // println("");
    // println(f"Shared Key 1: {key_1}");
    // println(f"Shared Key 2: {key_2}");
}
