import z from "zod";
import { concat, fromRlp, pad, toRlp, type Hex } from "viem";
import { BytesSchema } from "../utils/common.js";
import {
  chunkBytes,
  chunkBytesByFields,
  concatFields,
} from "../utils/chunk-utils.js";
import { FieldSchema, isField } from "../utils/field.js";

export const BYTES_PER_FIELD = 31;
export const FIELDS_PER_DATA_BLOB = 510;
export const MAX_DATA_BLOB_SIZE = BYTES_PER_FIELD * FIELDS_PER_DATA_BLOB;

export const DataBlobSchema = BytesSchema.refine(
  (val) => val.length === MAX_DATA_BLOB_SIZE,
  {
    message: `Data blob must be exactly ${MAX_DATA_BLOB_SIZE} bytes`,
  }
);

export type DataBlob = z.infer<typeof DataBlobSchema>;

export const bytesToDataBlobs = z.codec(z.array(DataBlobSchema), BytesSchema, {
  encode: (bytes) => {
    const rlpEncoded = new Uint8Array(toRlp(bytes, "bytes"));
    const chunks = chunkBytes(rlpEncoded, MAX_DATA_BLOB_SIZE);

    const blobs = chunks.map((chunk) =>
      // pad chunk to MAX_DATA_BLOB_SIZE bytes to make it a valid blob
      pad(chunk, { dir: "right", size: MAX_DATA_BLOB_SIZE })
    );

    return blobs.map((blobRaw) => DataBlobSchema.parse(blobRaw));
  },
  decode: (blobs) => {
    const mergedBlobs = concat(blobs);
    const rlpDecoded = fromRlp(mergedBlobs, "bytes");
    return BytesSchema.parse(rlpDecoded);
  },
});

export const dataBlobToFields = z.codec(z.array(FieldSchema), DataBlobSchema, {
  encode: (blob) => chunkBytesByFields(blob, BYTES_PER_FIELD),
  decode: (fields) => {
    if (fields.some((field) => !isField(field as Hex)))
      throw new Error(`Not a field`);
    return DataBlobSchema.parse(concatFields(fields, BYTES_PER_FIELD));
  },
});
