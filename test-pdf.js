const { PDFParse } = require("pdf-parse");
const fs = require("fs");
async function test() {
   const parser = new PDFParse();
   // wait, how to load? Maybe parser.load(buffer) or getText(buffer)?
   console.log("ready to test");
}
test();
