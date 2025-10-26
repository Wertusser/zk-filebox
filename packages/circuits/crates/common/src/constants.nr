pub global FIELDS_PER_BLOB: u32 = 510;
// global BYTES_PER_FIELD: u32 = 31;
// global MAX_LEN: u32 = FIELDS_PER_BLOB * BYTES_PER_FIELD;

pub global KEY_0_PREFIX: Field = 0x37820b5d4d7f3b41; //bytes8(keccak256(bytes("/key/0")))
pub global KEY_1_PREFIX: Field = 0x78d6c6567a0f27a8; //bytes8(keccak256(bytes("/key/1")))