import type { Metadata } from 'next'
import RoadmapClient from '@/components/RoadmapClient'

export const metadata: Metadata = {
    title: 'Product Roadmap | UseAI',
    description: 'A detailed look at every feature UseAI is building — from AI assistant and conversation intelligence to lead recovery and human-AI collaboration.',
}

export default function RoadmapPage() {
    return <RoadmapClient />
}
