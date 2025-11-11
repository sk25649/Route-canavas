import { NextRequest, NextResponse } from "next/server";
import type { ExportGPXRequest } from "@/lib/types";
import { buildGPX, validateGPXCoords } from "@/lib/gpx";

export async function POST(request: NextRequest) {
  try {
    const body: ExportGPXRequest = await request.json();
    const { name, coords } = body;

    // Validate coordinates
    const validation = validateGPXCoords(coords);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Build GPX XML
    const gpxContent = buildGPX(name || "RunCanvas Route", coords);

    // Return as downloadable file
    return new NextResponse(gpxContent, {
      status: 200,
      headers: {
        "Content-Type": "application/gpx+xml",
        "Content-Disposition": `attachment; filename="runcanvas-route.gpx"`,
      },
    });
  } catch (error) {
    console.error("GPX export error:", error);
    return NextResponse.json(
      { error: "Failed to generate GPX file" },
      { status: 500 }
    );
  }
}
