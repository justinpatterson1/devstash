import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  validateUpload,
  type UploadKind,
} from "@/lib/file-constraints";
import { buildObjectKey, publicUrlForKey, uploadObject } from "@/lib/r2";

export const runtime = "nodejs";

function isUploadKind(value: unknown): value is UploadKind {
  return value === "image" || value === "file";
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart payload" },
      { status: 400 }
    );
  }

  const kindRaw = form.get("kind");
  const file = form.get("file");

  if (!isUploadKind(kindRaw)) {
    return NextResponse.json(
      { error: "Missing or invalid kind" },
      { status: 400 }
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const validation = validateUpload(kindRaw, {
    name: file.name,
    size: file.size,
    type: file.type,
  });
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const key = buildObjectKey({
    userId: session.user.id,
    kind: kindRaw,
    fileName: file.name,
  });

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadObject({
      key,
      body: buffer,
      contentType: file.type || "application/octet-stream",
    });
  } catch (err) {
    console.error("R2 upload failed", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  return NextResponse.json({
    url: publicUrlForKey(key),
    name: file.name,
    size: file.size,
    contentType: file.type,
  });
}
