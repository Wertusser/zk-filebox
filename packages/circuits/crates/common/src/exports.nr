#[export]
pub fn get_key_commitment(key: [Field; 2], salt: Field) -> Field {
    super::utils::commit(key, salt)
}

// #[export]
// fn encrypt_key(master_key: Field, key: Field, nonce: Field) -> Field {
//     super::cipher::encrypt_single(master_key, key, nonce, 0)
// }

// #[export]
// fn decrypt_key(enc_master_key: Field, key: Field, nonce: Field) -> Field {
//     super::cipher::decrypt_single(enc_master_key, key, nonce, 0)
// }

#[export]
pub fn decrypt_packet(ciphers: [Field; 510 + 1], key: [Field; 2], nonce: Field) -> [Field; 510] {
    super::cipher::poseidon_decrypt(ciphers, key, nonce)
}

#[export]
fn derive_public_key(private_key: Field) -> [Field; 2] {
    super::ecdh::derive_public_key(private_key)
}

#[export]
fn derive_shared_key(private_key: Field, public_key_packed: [Field; 2]) -> Field {
    super::ecdh::derive_shared_key(private_key, public_key_packed)
}
