#[field(bn254)]
pub fn pack_bytes<let N: u32, let BYTES_PER_FIELD: u32>(
    bytes: [u8; N],
) -> [Field; (N + BYTES_PER_FIELD - 1) / BYTES_PER_FIELD] {
    assert(BYTES_PER_FIELD > 0, "bytesPerElement must be positive");
    assert(BYTES_PER_FIELD <= 31, "bytesPerElement must be <= 31");

    let mut out: [Field; (N + BYTES_PER_FIELD - 1) / BYTES_PER_FIELD] =
        [0; (N + BYTES_PER_FIELD - 1) / BYTES_PER_FIELD];

    for i in 0..((N + BYTES_PER_FIELD - 1) / BYTES_PER_FIELD) {
        let mut acc: Field = 0;
        for j in 0..BYTES_PER_FIELD {
            let byte_index = i * BYTES_PER_FIELD + j;

            // Only process if the byte_index is within the bounds of the input array
            if byte_index < N {
                let byte_value = bytes[byte_index] as Field;
                let exp = (BYTES_PER_FIELD - 1 - j) as Field;
                acc = acc + byte_value * 256.pow_32(exp);
            }
        }
        out[i] = acc;
    }

    out
}

#[field(bn254)]
pub fn unpack_bytes<let N: u32, let M: u32, let BYTES_PER_FIELD: u32>(
    felts: [Field; N],
) -> [u8; M] {
    let mut bytes: [u8; M] = [0; M];

    for i in 0..N {
        // Convert field to big-endian bytes (full 32-byte array)
        let field_bytes_full: [u8; BYTES_PER_FIELD] = felts[i].to_be_bytes();

        for j in 0..BYTES_PER_FIELD {
            let out_idx = i * BYTES_PER_FIELD + j;
            bytes[out_idx] = field_bytes_full[j];
        }
    }

    bytes
}

#[test]
fn test_pack_bytes_basic() {
    // Input: [0x01, 0x02, 0x03, 0x04, 0x05]
    let input_bytes = [1, 2, 3, 4, 5];

    // Expected output elements (BE):
    // Element 0: 0x0102 = 258
    // Element 1: 0x0304 = 772
    // Element 2: 0x0500 = 1280 (padded with 0)
    let packed: [Field; 3] = pack_bytes::<5, 2>(input_bytes);

    assert(packed[0] == (1 * 256 + 2));
    assert(packed[1] == (3 * 256 + 4));
    assert(packed[2] == (5 * 256 + 0));
}

#[test]
fn test_pack_bytes_single_element() {
    let input_bytes = [0xDE, 0xAD, 0xBE, 0xEF];

    // Expected output: [0xDEADBEEF]
    let packed: [Field; 1] = pack_bytes::<4, 4>(input_bytes);
    let expected: Field = (0xDE * 256 * 256 * 256) + (0xAD * 256 * 256) + (0xBE * 256) + 0xEF;
    assert(packed[0] == expected);
}

#[test]
fn test_pack_bytes_exact_multiple() {
    // Input: [0x0A, 0x0B, 0x0C, 0x0D]
    let input_bytes = [10, 11, 12, 13];

    // Expected output elements (BE):
    // Element 0: 0x0A0B = 2571
    // Element 1: 0x0C0D = 3085
    let packed: [Field; 2] = pack_bytes::<4, 2>(input_bytes);

    assert(packed[0] == (10 * 256 + 11));
    assert(packed[1] == (12 * 256 + 13));
}

#[test]
fn test_pack_bytes_one_byte_per_element() {
    // Input: [0x01, 0x02, 0x03]
    let input_bytes = [1, 2, 3];

    // Expected output elements (BE):
    // Element 0: 0x01 = 1
    // Element 1: 0x02 = 2
    // Element 2: 0x03 = 3
    let packed: [Field; 3] = pack_bytes::<3, 1>(input_bytes);

    assert(packed[0] == 1);
    assert(packed[1] == 2);
    assert(packed[2] == 3);
}

#[test]
fn test_pack_bytes_three_bytes_per_element() {
    // Input: [0x01, 0x02, 0x03, 0x04, 0x05]
    let input_bytes = [1, 2, 3, 4, 5];

    // Expected output elements (BE):
    // Element 0: 0x010203 = 66051
    // Element 1: 0x040500 = 263424 (padded with 00)
    let packed: [Field; 2] = pack_bytes::<5, 3>(input_bytes);

    assert(packed[0] == (1 * 256 * 256 + 2 * 256 + 3));
    assert(packed[1] == (4 * 256 * 256 + 5 * 256 + 0));
}

#[test]
fn test_pack_bytes_with_zeros() {
    // Input: [0x01, 0x00, 0x03, 0x00]
    let input_bytes = [1, 0, 3, 0];

    // Expected output elements (BE):
    // Element 0: 0x0100 = 256
    // Element 1: 0x0300 = 768
    let packed: [Field; 2] = pack_bytes::<4, 2>(input_bytes);

    assert(packed[0] == (1 * 256 + 0));
    assert(packed[1] == (3 * 256 + 0));
}

// Test for max bytes_per_element (31) - Example with a few bytes
#[test]
fn test_pack_bytes_max_element_size() {
    // Input: [0x01, ..., 0x1F] (31 bytes)
    let mut input_bytes = [0; 31];
    for i in 0..31 {
        input_bytes[i] = (i + 1) as u8;
    }

    let packed: [Field; 1] = pack_bytes::<31, 31>(input_bytes);

    let mut expected: Field = 0;
    for i in 0..31 {
        let byte_value = input_bytes[i] as Field;
        let mut power: Field = 1;
        for _ in 0..(31 - 1 - i) {
            power = power * 256;
        }
        expected = expected + byte_value * power;
    }

    assert(packed[0] == expected);
}

#[test]
fn test_pack_bytes_max_element_size_with_padding() {
    // Input: [0x01, ..., 0x20] (32 bytes)
    let mut input_bytes = [0; 32];
    for i in 0..32 {
        input_bytes[i] = (i + 1) as u8;
    }

    // Packing 32 bytes into elements of 31 bytes each
    // Element 0: bytes 0 to 30
    // Element 1: byte 31 (padded with 30 zeros)
    let packed: [Field; 2] = pack_bytes::<32, 31>(input_bytes);

    // Calculate expected for first element
    let mut expected0: Field = 0;
    for i in 0..31 {
        let byte_value = input_bytes[i] as Field;
        let mut power: Field = 1;
        for _ in 0..(31 - 1 - i) {
            power = power * 256;
        }
        expected0 = expected0 + byte_value * power;
    }

    // Calculate expected for second element (only byte 31, shifted to the highest position)
    let byte_value1 = input_bytes[31] as Field;
    let mut power: Field = 1;
    for _ in 0..(31 - 1 - 0) {
        power = power * 256;
    }
    let expected1: Field = byte_value1 * power;

    assert(packed[0] == expected0);
    assert(packed[1] == expected1);
}

#[test]
fn test_unpack_bytes_basic() {
    // Input: [0x01, 0x02, 0x03, 0x04, 0x05]
    let input_bytes = [1, 2, 3, 4, 5, 0];

    let packed: [Field; 3] = pack_bytes::<6, 2>(input_bytes);
    let out_bytes: [u8; 6] = unpack_bytes::<3, 6, 2>(packed);

    assert(input_bytes == out_bytes);
}
