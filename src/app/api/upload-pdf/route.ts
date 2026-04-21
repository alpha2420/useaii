import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const ownerId = formData.get("ownerId") as string | null;

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

            pdfParser.on("pdfParser_dataReady", async () => {
                try {
                    const text = pdfParser.getRawTextContent().replace(/\r\n/g, "\n").trim();
                    
                    // Always return the extracted text to the client immediately
                    resolve(NextResponse.json({ success: true, text }));

                    // Attempt to index via RAG in the background (non-blocking)
                    // This will work once Atlas Vector Search index is set up
                    if (ownerId) {
                        import("@/lib/rag").then(({ processAndStoreText }) => {
                            processAndStoreText(ownerId, text, `pdf_${file.name}`)
                                .then(() => console.log(`[PDF] RAG indexing complete for ${file.name}`))
                                .catch((err) => console.warn("[PDF] RAG indexing skipped (Atlas index not set up yet):", err?.message));
                        }).catch(() => {});
                    }

                } catch (err) {
                    console.error("PDF text extraction error:", err);
                    resolve(NextResponse.json({ error: "Failed to extract text from PDF" }, { status: 500 }));
                }
            });

            pdfParser.parseBuffer(buffer);
        });

    } catch (error: unknown) {
        console.error("PDF Route error:", error);
        return NextResponse.json({ error: "Failed to process PDF upload" }, { status: 500 });
    }
}

