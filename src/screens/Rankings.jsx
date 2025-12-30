import React from 'react';
import { Trophy } from 'lucide-react';
import { ComingSoon } from '../components/common/ComingSoon';

export function Rankings() {
    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <ComingSoon
                title="Global Rankings"
                description="Our global leaderboard is being updated significantly. Check back soon for real-time city rankings."
                icon={Trophy}
            />
        </div>
    );
}
