use common::{cipher::poseidon_encrypt, utils::commit};

global FIELDS_PER_BLOB: u32 = 510;
// global BYTES_PER_FIELD: u32 = 31;
// global MAX_LEN: u32 = FIELDS_PER_BLOB * BYTES_PER_FIELD;

fn main(
    key_commit: pub Field,
    nonce: pub Field,
    plains: [Field; FIELDS_PER_BLOB],
    key: [Field; 2],
    salt: Field,
) -> pub [Field; FIELDS_PER_BLOB + 1] {
    assert(key_commit == commit(key, salt));
    poseidon_encrypt(plains, key, nonce)
}

#[test]
fn test_main() {}
