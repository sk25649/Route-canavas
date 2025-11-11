import { NextRequest, NextResponse } from "next/server";
import type { ExportTCXRequest } from "@/lib/types";
import { buildTCX, validateTCXCoords } from "@/lib/tcx";

export async function POST(request: NextRequest) {
  try {
    const body: ExportTCXRequest = await request.json();
    const { name, coords } = body;

    // Validate coordinates
    const validation = validateTCXCoords(coords);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Build TCX XML
    const tcxContent = buildTCX(name || "RunCanvas Route", coords);

    // Return as downloadable file
    return new NextResponse(tcxContent, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.garmin.tcx+xml",
        "Content-Disposition": `attachment; filename="runcanvas-route.tcx"`,
      },
    });
  } catch (error) {
    console.error("TCX export error:", error);
    return NextResponse.json(
      { error: "Failed to generate TCX file" },
      { status: 500 }
    );
  }
}
