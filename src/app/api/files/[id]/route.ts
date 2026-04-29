import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getItemById } from "@/lib/db/items";
import { getObjectStream, keyFromPublicUrl } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const item = await getItemById(session.user.id, id);
  if (!item || !item.fileUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const key = keyFromPublicUrl(item.fileUrl);
  if (!key) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  let object;
  try {
    object = await getObjectStream(key);
  } catch (err) {
    console.error("R2 fetch failed", err);
    return NextResponse.json({ error: "File unavailable" }, { status: 502 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    object.contentType ?? "application/octet-stream"
  );
  if (object.contentLength !== undefined) {
    headers.set("Content-Length", String(object.contentLength));
  }
  const filename = item.fileName ?? "download";
  headers.set(
    "Content-Disposition",
    `attachment; filename="${filename.replace(/"/g, "")}"`
  );
  headers.set("Cache-Control", "private, max-age=0, must-revalidate");

  return new Response(object.body, { status: 200, headers });
}
