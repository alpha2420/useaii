/**
 * preprocessMessage.ts
 * Cleans and normalizes raw customer input before sending to AI.
 * Goal: reduce token count, improve AI accuracy, remove noise.
 */

// ── Common WhatsApp slang & shorthand expansions ──────────────────────────────
const SLANG_MAP: Record<string, string> = {
    "wats":    "what is",
    "wat":     "what",
    "wht":     "what",
    "ur":      "your",
    "u":       "you",
    "r":       "are",
    "pls":     "please",
    "plz":     "please",
    "plss":    "please",
    "thx":     "thanks",
    "ty":      "thank you",
    "thnx":    "thanks",
    "thnks":   "thanks",
    "cn":      "can",
    "cud":     "could",
    "wud":     "would",
    "shud":    "should",
    "nd":      "and",
    "n":       "and",
    "hw":      "how",
    "hru":     "how are you",
    "btw":     "by the way",
    "asap":    "as soon as possible",
    "info":    "information",
    "msg":     "message",
    "num":     "number",
    "no":      "number",    // only in context like "mobile no"
    "prob":    "problem",
    "prb":     "problem",
    "bro":     "",          // filler — remove
    "yaar":    "",          // filler — remove
    "hmm":     "",          // filler — remove
    "umm":     "",          // filler — remove
    "ummm":    "",          // filler — remove
    "uhh":     "",          // filler — remove
    "like":    "",          // conversational filler — remove
    "ok":      "",          // trailing filler — remove (only standalone)
    "okay":    "",          // trailing filler — remove (only standalone)
    "hii":     "hi",
    "helo":    "hello",
    "helllo":  "hello",
    "helloo":  "hello",
    "thr":     "there",
    "gr8":     "great",
    "nw":      "now",
    "tmr":     "tomorrow",
    "tmrw":    "tomorrow",
    "ya":      "yes",
    "yep":     "yes",
    "nope":    "no",
    "cant":    "cannot",
    "wont":    "will not",
    "dont":    "do not",
    "didnt":   "did not",
    "isnt":    "is not",
    "arent":   "are not",
    "refund":  "refund",    // preserve important business words as-is
};

// ── Filler phrases to remove entirely ────────────────────────────────────────
const FILLER_PHRASES = [
    "you know", "i mean", "kind of", "sort of", "by the way",
    "just wanted to", "i just", "can you please", "could you please",
    "would you please", "hey there", "hi there",
];

/**
 * Main pre-processing function.
 * Takes raw customer message → returns cleaned, token-efficient version.
 */
export function preprocessMessage(raw: string): string {
    if (!raw || typeof raw !== "string") return "";

    let text = raw;

    // 1. Truncate extremely long messages (prevents token explosion)
    if (text.length > 400) {
        text = text.slice(0, 400);
    }

    // 2. Remove emojis and non-ASCII decorative characters
    //    (keep basic punctuation, letters, numbers)
    text = text.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        " "
    );

    // 3. Lowercase
    text = text.toLowerCase();

    // 4. Fix repeated punctuation: "?????" → "?", "!!!" → "!", "..." → "."
    text = text.replace(/\?{2,}/g, "?");
    text = text.replace(/!{2,}/g, "!");
    text = text.replace(/\.{2,}/g, ".");
    text = text.replace(/,{2,}/g, ",");

    // 5. Remove filler phrases
    for (const phrase of FILLER_PHRASES) {
        text = text.replace(new RegExp(`\\b${phrase}\\b`, "gi"), " ");
    }

    // 6. Expand slang word by word
    text = text
        .split(/\s+/)
        .map((word) => {
            // Strip trailing punctuation before lookup
            const punctMatch = word.match(/^([a-z']+)([?!.,]*)$/);
            if (punctMatch) {
                const base = punctMatch[1];
                const punct = punctMatch[2];
                const expanded = SLANG_MAP[base];
                if (expanded !== undefined) {
                    return expanded ? expanded + punct : ""; // empty string removes the word
                }
            }
            return word;
        })
        .filter(Boolean) // remove empty strings (filler words)
        .join(" ");

    // 7. Collapse multiple spaces
    text = text.replace(/\s{2,}/g, " ").trim();

    // 8. If the cleaned message is too short or meaningless, return original
    //    (safety — never return an empty string to the AI)
    if (text.length < 3) {
        return raw.slice(0, 300).trim();
    }

    return text;
}
