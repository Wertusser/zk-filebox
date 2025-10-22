use super::utils::poseidon2_hash;
use poseidon::poseidon2_permutation;

#[field(bn254)]
fn compute_pad(key: Field, nonce: Field, counter: u32) -> Field {
    poseidon2_hash([key, nonce, counter as Field])
}

#[field(bn254)]
pub fn encrypt_single(plains: Field, key: Field, nonce: Field, counter: u32) -> Field {
    plains + compute_pad(key, nonce, counter)
}

#[field(bn254)]
pub fn decrypt_single(ciphers: Field, key: Field, nonce: Field, counter: u32) -> Field {
    ciphers - compute_pad(key, nonce, counter)
}

#[field(bn254)]
pub fn encrypt<let N: u32>(plains: [Field; N], key: Field, nonce: Field) -> [Field; N] {
    plains.mapi(|i, p| encrypt_single(p, key, nonce, i))
}

#[field(bn254)]
pub fn decrypt<let N: u32>(ciphers: [Field; N], key: Field, nonce: Field) -> [Field; N] {
    ciphers.mapi(|i, c| decrypt_single(c, key, nonce, i))
}

#[field(bn254)]
pub fn poseidon_encrypt<let N: u32>(
    plains: [Field; N],
    key: [Field; 2],
    nonce: Field,
) -> [Field; N + 1] {
    assert(nonce.lt(0x100000000000000000000000000000000));

    let padded_nonce = nonce + (N as Field) * 0x100000000000000000000000000000000;
    let mut state: [Field; 4] = [0, key[0], key[1], padded_nonce];

    let state_len = state.len();
    assert(N >= state_len - 1);

    let mut ciphers: [Field; N + 1] = [0; N + 1];

    for i in 0..(N / (state_len - 1)) {
        state = poseidon2_permutation(state, state_len);

        for j in 1..state_len {
            let index = i * (state_len - 1) + j - 1;
            state[j] += plains[index];
            ciphers[index] = state[j];
        }
    }

    state = poseidon2_permutation(state, state_len);
    for i in (N - (N % (state_len - 1)))..N {
        let index = (i % (state_len - 1)) + 1;
        state[index] += plains[i];
        ciphers[i] = state[index];
    }

    state = poseidon2_permutation(state, state_len);
    ciphers[N] = state[1];
    ciphers
}

#[field(bn254)]
pub fn poseidon_decrypt<let N: u32>(
    ciphers: [Field; N + 1],
    key: [Field; 2],
    nonce: Field,
) -> [Field; N] {
    assert(nonce.lt(0x100000000000000000000000000000000));

    let padded_nonce = nonce + (N as Field) * 0x100000000000000000000000000000000;
    let mut state: [Field; 4] = [0, key[0], key[1], padded_nonce];

    let state_len = state.len();
    assert(N >= state_len - 1);

    let mut plains: [Field; N] = [0; N];

    for i in 0..(N / (state_len - 1)) {
        state = poseidon2_permutation(state, state_len);

        for j in 1..state_len {
            let index = i * (state_len - 1) + j - 1;
            plains[index] = ciphers[index] - state[j];
            state[j] = ciphers[index];
        }
    }

    state = poseidon2_permutation(state, state_len);
    for i in (N - (N % (state_len - 1)))..N {
        let index = (i % (state_len - 1)) + 1;
        plains[i] = ciphers[i] - state[index];
        state[index] = ciphers[i];
    }

    state = poseidon2_permutation(state, state_len);
    assert(ciphers[N] == state[1]);
    plains
}

#[test]
fn test_e2e() {
    let key = 0x1ff18c97cd54b27391280a1f24cc94ef8c05e421525eb05bd4ded690735bf961;
    let nonce = 1337;

    let msg = [22405534230753963835153736737; 256]; // "Hello world!"
    let encrypted = encrypt(msg, key, nonce);
    let new_msg = decrypt(encrypted, key, nonce);

    assert(msg == new_msg);

    // println(f"Key: {key}");
    // println(f"nonce: {nonce}");

    // println(f"Original: {msg}");
    // println(f"Encrypted: {encrypted}");
    // println(f"Decrypted: {new_msg}");
}

#[test]
fn test_e2e_poseidon() {
    let key: [Field; 2] = [
        0x1ff18c97cd54b27391280a1f24cc94ef8c05e421525eb05bd4ded690735bf961,
        0x1ff18c97cd54b27391280a1f24cc94ef8c05e421525eb05bd4ded690735bf961,
    ];
    let nonce = 1337;

    let msg = [22405534230753963835153736737; 1024]; // "Hello world!"
    let encrypted = poseidon_encrypt(msg, key, nonce);
    let new_msg = poseidon_decrypt(encrypted, key, nonce);

    assert(msg == new_msg);

    // println(f"Key: {key}");
    // println(f"nonce: {nonce}");

    // println(f"Original: {msg}");
    // println(f"Encrypted: {encrypted}");
    // println(f"Decrypted: {new_msg}");
}
