import { motion } from 'framer-motion';
import { cities, getAQIColor } from '../data/mockData';

export function CompareLocations() {
    const maxAQI = Math.max(...cities.map(c => c.aqi)) * 1.2;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>City Comparison</h2>
                <p>Live AQI Levels</p>
            </div>

            <div className={styles.chartArea}>
                {cities.map((city, index) => {
                    const color = getAQIColor(city.aqi);
                    const heightPercent = (city.aqi / maxAQI) * 100;

                    return (
                        <div key={city.id} className={styles.barColumn}>

                            {/* Floating Bar */}
                            <motion.div
                                className={styles.bar}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: `${heightPercent}%`, opacity: 1 }}
                                transition={{ duration: 1, type: "spring", delay: index * 0.1 }}
                                style={{ background: `linear-gradient(to top, ${color}20, ${color})` }}
                            >
                                {/* Floating Bubble on top */}
                                <motion.div
                                    className={styles.valueBubble}
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2 + index, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <span style={{ color: color }}>{city.aqi}</span>
                                </motion.div>
                            </motion.div>

                            <div className={styles.cityLabel}>{city.name}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
