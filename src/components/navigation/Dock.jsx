import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, TrendingUp, Calendar, Globe } from 'lucide-react';

export function Dock({ onTabChange }) {
    const [activeTab, setActiveTab] = useState('live');

    const tabs = [
        { id: 'live', icon: Cloud, label: 'Live' },
        { id: 'trends', icon: TrendingUp, label: 'Trends' },
        { id: 'forecast', icon: Calendar, label: 'Forecast' },
        { id: 'compare', icon: Globe, label: 'Compare' },
    ];

    const handleTabClick = (id) => {
        setActiveTab(id);
        onTabChange(id);
    };

    return (
        <motion.div
            className="fixed bottom-8 left-0 w-full flex justify-center z-[100] pointer-events-none"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
        >
            <div className="pointer-events-auto flex gap-8 px-10 py-4 bg-[rgba(2,6,23,0.6)] backdrop-blur-[20px] rounded-[32px] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <motion.button
                            key={tab.id}
                            className={`bg-transparent border-none flex flex-col items-center gap-1 cursor-pointer relative transition-colors duration-300 ${isActive ? 'text-neon-cyan' : 'text-text-secondary'}`}
                            onClick={() => handleTabClick(tab.id)}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <Icon size={24} color={isActive ? '#00f0ff' : '#94a3b8'} />
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-[-5px] bg-[radial-gradient(circle,rgba(0,240,255,0.3)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-[4px] z-[-1]"
                                        layoutId="activeGlow"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </div>
                            <span className="text-[10px] font-medium tracking-[0.5px] opacity-80">{tab.label}</span>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
