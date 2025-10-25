/**
 * Byte masking for a text
 * @dev uses fixed sized arrays for masks since saves constraints and shouldn't have security cost
 *
 * @param N - The length of the text to mask
 * @param text - The text to mask
 * @param mask - The mask to apply to the text
 * @return - The masked text
 */
pub fn mask_bytes<let N: u32>(bytes: [u8; N], mask: [u1; N]) -> [u8; N] {
    let mut masked_text = [0; N];
    for i in 0..N {
        masked_text[i] = (bytes[i] * mask[i] as u8);
    }
    masked_text
}
