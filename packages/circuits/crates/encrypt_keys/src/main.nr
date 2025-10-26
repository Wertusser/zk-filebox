use common::{cipher::encrypt, ecdh::{derive_public_key, derive_shared_key}, utils::commit};

fn main(
    key_commitment: pub Field,
    from_pub: pub [Field; 2],
    to_pub: pub [Field; 2],
    nonce: pub Field,
    master_key: Field,
    private_key: Field,
    salt: Field,
) -> pub Field {
    assert(from_pub == derive_public_key(private_key));
    assert(key_commitment == commit([master_key], salt));

    let shared_key = derive_shared_key(private_key, to_pub);
    encrypt([master_key], shared_key, nonce)[0]
}

#[test]
fn test_main() {
    // let a_key = Poseidon2::hash([0], 1);
    // let a_pubkey = derive_public_key(a_key);

    // let b_key = Poseidon2::hash([1], 1);
    // let b_pubkey = derive_public_key(b_key);

    // let mut msg = [0; FIELDS_PER_MESSAGE];
    // let nonce = 0x123456789;
    // let domain_tag = 0xdeadbeef;

    // let msg_hash = Poseidon2::hash(msg, FIELDS_PER_MESSAGE);
    // let commitment = commit(msg_hash, nonce, domain_tag);
    // let cipher_text = main(
    //     commitment,
    //     b_pubkey,
    //     a_pubkey,
    //     nonce,
    //     domain_tag,
    //     msg_hash,
    //     msg,
    //     b_key,
    // );

    // let shared_key = derive_shared_key(a_key, b_pubkey);
    // let recovered_msg = decrypt(cipher_text, shared_key, nonce, domain_tag);

    // assert(msg == recovered_msg);
}
