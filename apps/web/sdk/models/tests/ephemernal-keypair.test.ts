import { expect, test } from "vitest";
import { EphemernalKeypair } from "../ephemernal-keypair";

test.concurrent("ephemernal key", async () => {
  const aliceKeypair = EphemernalKeypair.random();
  const alicePubkey = await aliceKeypair.publicKey();

  const bobKeypair = EphemernalKeypair.random();
  const bobPubkey = await bobKeypair.publicKey();

  expect(alicePubkey).to.not.eq(bobPubkey);

  const keyA = await aliceKeypair.sharedKey(bobPubkey);
  const keyB = await bobKeypair.sharedKey(alicePubkey);

  expect(keyA).toBe(keyB);
});
