use common::{ecdh::{derive_public_key, derive_shared_key}, utils::poseidon2_hash};

fn main(buyer_pub: pub [Field; 2], seller_pub: [Field; 2], buyer_priv: Field) -> pub Field {
    assert(buyer_pub == derive_public_key(buyer_priv));
    // return poseidon hash of shared key
    poseidon2_hash([derive_shared_key(buyer_priv, seller_pub)])
}

#[test]
fn test_main() {}
