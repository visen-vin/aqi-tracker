import { motion } from 'framer-motion';
import { FloatingElement } from '../components/ui/FloatingElement';
import { cities } from '../data/mockData';

export function HistoricalTrends() {
    const city = cities[0];
    const data = city.trend;
    const maxVal = Math.max(...data) * 1.2;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (val / maxVal) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className={styles.container}>
            <FloatingElement depth={0.5} className={styles.header}>
                <h2>Trends</h2>
                <div className={styles.timeChips}>
                    {['1H', '24H', '7D'].map((t, i) => (
                        <span key={t} className={`${styles.chip} ${i === 1 ? styles.activeChip : ''}`}>{t}</span>
                    ))}
                </div>
            </FloatingElement>

            <div className={styles.chartContainer}>
                <motion.div
                    className={styles.chartPlane}
                    initial={{ rotateX: 20, scale: 0.9, opacity: 0 }} /* Flattened from 45/60 */
                    animate={{ rotateX: 25, scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                >
                    <svg viewBox="0 0 100 100" className={styles.chartSvg} preserveAspectRatio="none">
                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Area */}
                        <motion.path
                            d={`M 0,100 ${points} 100,100 Z`}
                            fill="url(#chartGradient)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />

                        {/* Line */}
                        <motion.polyline
                            points={points}
                            fill="none"
                            stroke="var(--neon-cyan)"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />

                        {/* Points */}
                        {data.map((val, i) => {
                            const x = (i / (data.length - 1)) * 100;
                            const y = 100 - (val / maxVal) * 100;
                            return (
                                <motion.circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r="1.5"
                                    fill="#fff"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                />
                            )
                        })}
                    </svg>

                    {/* Grid Lines for Depth Reference */}
                    <div className={styles.gridPlane}>
                        {[0, 25, 50, 75, 100].map(p => (
                            <div key={p} className={styles.gridLine} style={{ top: `${p}%` }} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
