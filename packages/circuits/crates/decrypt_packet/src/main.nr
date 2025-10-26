use common::{
    cipher::poseidon_decrypt,
    constants::{FIELDS_PER_BLOB, KEY_0_PREFIX, KEY_1_PREFIX},
    utils::poseidon2_hash,
};

fn main(
    key_hash: pub Field,
    nonce: pub Field,
    prefix: pub Field,
    ciphers: pub [Field; FIELDS_PER_BLOB + 1],
    master_seed: Field,
    salt: Field,
) -> pub [Field; FIELDS_PER_BLOB] {
    assert(key_hash == poseidon2_hash([master_seed, salt]));
    let key = [
        poseidon2_hash([master_seed, prefix, KEY_0_PREFIX]),
        poseidon2_hash([master_seed, prefix, KEY_1_PREFIX]),
    ];
    poseidon_decrypt(ciphers, key, nonce)
}

#[test]
fn test_main() {}
