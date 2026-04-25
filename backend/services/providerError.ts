import WhatsappStatus from '../models/whatsapp-status.model';

export async function clearProviderError(ownerId: string, provider: 'openai' | 'gemini' | 'grok' | 'groq') {
    await WhatsappStatus.findOneAndUpdate({ ownerId }, { $unset: { [`providerStatus.${provider}`]: "" } }).catch(() => {});
}

export async function reportProviderError(ownerId: string, provider: 'openai' | 'gemini' | 'grok' | 'groq', error: any) {
    let msg = error?.status === 429 
        ? "Quota exceeded (Rate limit)" 
        : error?.status === 401 
            ? "Invalid API key" 
            : error?.message || String(error);
    
    await WhatsappStatus.findOneAndUpdate(
        { ownerId }, 
        { $set: { [`providerStatus.${provider}`]: { error: msg, updatedAt: new Date() } } }
    ).catch(() => {});
}
