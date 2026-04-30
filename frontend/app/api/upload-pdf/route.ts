import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

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
            const pdfParser = new PDFParser(null, true);
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pdfParser.on("pdfParser_dataError", (errData: any) => {
                console.error("PDF Parsing error:", errData.parserError);
                resolve(NextResponse.json({ error: "Failed to parse PDF document" }, { status: 500 }));
            });

function cleanPdfText(raw: string) {
    return raw
        .replace(/\n{3,}/g, '\n\n')     // remove excessive line breaks
        .replace(/[^\x20-\x7E\n]/g, '') // remove weird characters
        .replace(/[ \t]+/g, ' ')        // normalize horizontal spaces
        .trim();
}

            pdfParser.on("pdfParser_dataReady", () => {
                const rawText = pdfParser.getRawTextContent().replace(/\r\n/g, "\n");
                const text = cleanPdfText(rawText);
                resolve(NextResponse.json({ text }));
            });

            pdfParser.parseBuffer(buffer);
        });

    } catch (error: unknown) {
        console.error("PDF Route error:", error);
        return NextResponse.json({ error: "Failed to process PDF upload" }, { status: 500 });
    }
}
