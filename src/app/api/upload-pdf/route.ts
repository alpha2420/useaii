import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
const PDFParser = require("pdf2json");

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise<NextResponse>((resolve) => {
            const pdfParser = new PDFParser(null, 1);
            
            pdfParser.on("pdfParser_dataError", (errData: any) => {
                console.error("PDF Parsing error:", errData.parserError);
                resolve(NextResponse.json({ error: "Failed to parse PDF document" }, { status: 500 }));
            });

            pdfParser.on("pdfParser_dataReady", () => {
                const text = pdfParser.getRawTextContent().replace(/\r\n/g, "\n");
                resolve(NextResponse.json({ text }));
            });

            pdfParser.parseBuffer(buffer);
        });

    } catch (error: any) {
        console.error("PDF Route error:", error);
        return NextResponse.json({ error: "Failed to process PDF upload" }, { status: 500 });
    }
}
