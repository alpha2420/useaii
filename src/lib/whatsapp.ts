import WhatsappStatus from '@/model/whatsapp-status.model';
import connectDb from './db';

// Safely registers a signal in the database for the standalone worker to pick up and start a headless browser.
export const getWhatsAppClient = async (ownerId: string) => {
    await connectDb();
    
    const existing = await WhatsappStatus.findOne({ ownerId });
    if (!existing) {
        await WhatsappStatus.create({
            ownerId,
            isReady: false,
            qrCode: null,
            disconnectRequested: false
        });
    }
    
    return null; // The worker process handles the actual client logic
};

// Returns the live status populated dynamically by the background worker.
export const getWhatsAppStatus = async (ownerId: string) => {
    await connectDb();
    
    const status = await WhatsappStatus.findOne({ ownerId });
    if (!status || status.disconnectRequested) {
        return { isReady: false, qrCode: null };
    }
    
    return {
        isReady: status.isReady,
        qrCode: status.qrCode
    };
};

// Triggers a flag in the DB instructing the worker to disconnect and cleanup memory.
export const disconnectWhatsApp = async (ownerId: string) => {
    await connectDb();
    
    const status = await WhatsappStatus.findOne({ ownerId });
    if (status) {
        status.disconnectRequested = true;
        await status.save();
    }
    
    return { success: true };
};
