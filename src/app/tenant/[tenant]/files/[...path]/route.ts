import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface Params {
  tenant: string;
  path: string | string[] | undefined;
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { tenant, path } = await params;

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  const filePath = `/${tenant}/${Array.isArray(path) ? path.join("/") : path}`;

  try {
    const context = await getCloudflareContext({ async: true });
    const bucket = context.env.PROCOMPLY_BUCKET;
    const object = await bucket.get(filePath);

    if (object === null) {
      return new Response("Object Not Found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
