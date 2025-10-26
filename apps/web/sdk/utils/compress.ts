import { zlibSync, unzlibSync } from "fflate";
import { encode, decode } from "@msgpack/msgpack";
import { Bytes } from "./common";

export function compress(bytes: Bytes): Bytes {
  return new Uint8Array([...zlibSync(bytes, { level: 9 })]);
}

export function decompress(bytes: Bytes): Bytes {
  return new Uint8Array([...unzlibSync(bytes)]);
}

export async function compressFiles(files: File[]): Promise<Bytes> {
  const entries = await Promise.all(
    files.map(async (f) => [
      f.name,
      await f.arrayBuffer().then((data) => new Uint8Array(data)),
    ])
  );
  const object = Object.fromEntries(entries);
  const encoded = new Uint8Array(encode(object));
  return compress(encoded);
}

export async function decompressFiles(compressed: Bytes): Promise<File[]> {
  const object = decode(decompress(compressed)) as Record<string, Bytes>;
  return Object.entries(object).map(([k, v]) => new File([v], k));
}
