export interface DashboardStats {
    overview: {
        totalConversations: number;
        newToday: number;
        totalMessages: number;
        hotLeadsThisWeek: number;
        wonDeals: number;
        avgMessagesPerConvo: number;
    };
    leads: Record<string, number>;
    stages: Record<string, number>;
    intents: Record<string, number>;
    urgency: Record<string, number>;
    last7Days: { date: string; label: string; count: number }[];
    topUnanswered: { _id: string; question: string; source: string; createdAt: string }[];
    channels: Record<string, number>;
    message?: string; // Optional message field for error responses
}
