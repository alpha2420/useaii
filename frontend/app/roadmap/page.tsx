import type { Metadata } from 'next'
import RoadmapClient from '@/components/RoadmapClient'

export const metadata: Metadata = {
    title: 'Product Roadmap | UseConverra',
    description: 'A detailed look at every feature UseConverra is building — from AI assistant and conversation intelligence to lead recovery and human-AI collaboration.',
}

export default function RoadmapPage() {
    return <RoadmapClient />
}
