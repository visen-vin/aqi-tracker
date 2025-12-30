import React from 'react';
import { Map as MapIcon } from 'lucide-react';
import { ComingSoon } from '../components/common/ComingSoon';

export function Map() {
    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <ComingSoon
                title="Interactive Map"
                description="Explore air quality across the globe with our upcoming interactive map feature."
                icon={MapIcon}
            />
        </div>
    );
}
