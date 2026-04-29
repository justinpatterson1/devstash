import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { randomBytes } from "node:crypto";
import { getExtension } from "@/lib/file-constraints";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

let client: S3Client | null = null;
function getClient(): S3Client {
  if (client) return client;
  client = new S3Client({
    region: "auto",
    endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env("R2_ACCESS_KEY_ID"),
      secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
    },
  });
  return client;
}

export function buildObjectKey(opts: {
  userId: string;
  kind: "image" | "file";
  fileName: string;
}): string {
  const ext = getExtension(opts.fileName);
  const id = randomBytes(12).toString("hex");
  const suffix = ext ? `.${ext}` : "";
  return `users/${opts.userId}/${opts.kind}/${id}${suffix}`;
}

export function publicUrlForKey(key: string): string {
  const base = env("R2_PUBLIC_URL").replace(/\/$/, "");
  return `${base}/${key}`;
}

export function keyFromPublicUrl(url: string): string | null {
  try {
    const base = new URL(env("R2_PUBLIC_URL"));
    const parsed = new URL(url);
    if (parsed.host !== base.host) return null;
    return parsed.pathname.replace(/^\//, "");
  } catch {
    return null;
  }
}

export async function uploadObject(opts: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<void> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: env("R2_BUCKET_NAME"),
      Key: opts.key,
      Body: opts.body,
      ContentType: opts.contentType,
    })
  );
}

export async function deleteObject(key: string): Promise<void> {
  await getClient().send(
    new DeleteObjectCommand({
      Bucket: env("R2_BUCKET_NAME"),
      Key: key,
    })
  );
}

export async function getObjectStream(key: string): Promise<{
  body: ReadableStream;
  contentType: string | undefined;
  contentLength: number | undefined;
}> {
  const result = await getClient().send(
    new GetObjectCommand({
      Bucket: env("R2_BUCKET_NAME"),
      Key: key,
    })
  );

  if (!result.Body) {
    throw new Error("Empty response body from R2");
  }

  return {
    body: result.Body.transformToWebStream(),
    contentType: result.ContentType,
    contentLength: result.ContentLength,
  };
}
