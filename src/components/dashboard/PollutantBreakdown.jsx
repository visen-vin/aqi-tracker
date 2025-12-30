import { motion } from 'framer-motion';
import { Cloud, Wind, Droplets, ThermometerSun, ChevronRight } from 'lucide-react';

const pollutantConfig = {
    pm25: { name: 'PM2.5', unit: 'µg/m³', icon: Cloud, threshold: 60 },
    pm10: { name: 'PM10', unit: 'µg/m³', icon: Cloud, threshold: 100 },
    no2: { name: 'NO2', unit: 'ppb', icon: Wind, threshold: 80 },
    so2: { name: 'SO2', unit: 'ppb', icon: Droplets, threshold: 80 },
    co: { name: 'CO', unit: 'ppb', icon: ThermometerSun, threshold: 4 },
    o3: { name: 'O3', unit: 'ppb', icon: ThermometerSun, threshold: 100 },
};

export function PollutantBreakdown({ pollutants, location = 'New Delhi' }) {
    // Convert object to array for mapping
    const items = Object.entries(pollutants).map(([key, value]) => {
        const config = pollutantConfig[key] || { name: key, unit: '', icon: Cloud, threshold: 0 };
        // Determine status/color based on visual reference or mock logic
        let color = '#4ade80'; // Green (Good) default for CO, SO2, NO2, O3
        if (key === 'pm25') color = '#c084fc'; // Purple
        if (key === 'pm10') color = '#f472b6'; // Pink/Red

        // Mocking Warning
        const showWarning = (key === 'pm10' || key === 'pm25');

        return {
            key,
            value,
            ...config,
            color,
            showWarning
        };
    });

    return (
        <div id="overview" className="w-full mt-8 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-wide">Major Air Pollutants</h3>
                    <p className="text-[#3b82f6] font-semibold text-lg hover:underline cursor-pointer mt-1">{location}</p>
                </div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.key}
                        className="relative bg-[#1e293b] rounded-2xl p-3 md:p-4 flex items-center justify-between group hover:bg-[#253045] transition-colors shadow-lg border border-white/5"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                    >
                        {/* Left Colored Border/Pill */}
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-10 md:h-12 w-1.5 md:w-2 rounded-r-full"
                            style={{ backgroundColor: item.color }}
                        />

                        {/* Content */}
                        <div className="flex items-center gap-2 md:gap-5 pl-2 md:pl-3 w-full">
                            {/* Icon Wrapper */}
                            <div className="text-gray-500 opacity-80 min-w-[24px]">
                                <item.icon size={24} className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                            </div>

                            {/* Text Info */}
                            <div className="flex flex-col min-w-0">
                                <span className="text-gray-400 font-bold text-[10px] md:text-sm tracking-wide uppercase">{item.name}</span>
                                <div className="flex flex-wrap items-baseline gap-1">
                                    <span className="text-lg md:text-2xl font-bold text-white tracking-tight">{item.value}</span>
                                    <span className="text-[10px] md:text-xs text-gray-500 font-semibold truncate">{item.unit}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Arrow - Hide on very small screens if needed, otherwise small */}
                        <div className="text-gray-600 pr-1 md:pr-2 hidden sm:block">
                            <ChevronRight size={20} strokeWidth={2} />
                        </div>

                        {/* Warning Badge (Clean Version) */}
                        {item.showWarning && (
                            <div className="absolute -top-1 -right-1 z-10">
                                <div className="relative flex h-5 w-5 md:h-6 md:w-6">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-full w-full bg-red-500 items-center justify-center border-2 border-[#1e293b]">
                                        <span className="text-white text-[10px] md:text-xs font-bold">!</span>
                                    </span>
                                </div>
                            </div>
                        )}

                    </motion.div>
                ))}
            </div>
        </div>
    );
}
