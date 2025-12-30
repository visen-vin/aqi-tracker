import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cities, getAQIColor } from '../data/mockData';

export function Forecast() {
    const city = cities[0];
    const containerRef = useRef(null);

    // We'll just map over the forecast data 
    // In a real app we might use scroll position to drive 3D transforms

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Forecast</h2>
                <p>5-Day Outlook</p>
            </div>

            <div className={styles.scrollTrack} ref={containerRef}>
                <div className={styles.timeline}>
                    {city.forecast.map((day, i) => {
                        const color = getAQIColor(day.aqi);

                        return (
                            <motion.div
                                key={day.day}
                                className={styles.dayCard}
                                initial={{ opacity: 0, y: 50, rotateY: 30 }}
                                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.8, type: "spring" }}
                                whileHover={{ scale: 1.05, rotateY: -10, z: 50 }}
                            >
                                <div className={styles.dayLabel}>{day.day}</div>
                                <div className={styles.aqi} style={{ color }}>{day.aqi}</div>
                                <div
                                    className={styles.aura}
                                    style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
