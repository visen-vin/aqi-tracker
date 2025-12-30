import { motion } from 'framer-motion';
import { FloatingElement } from '../components/ui/FloatingElement';
import { cities, getAQIColor } from '../data/mockData';
import { Wind, CloudRain, Thermometer, Droplets } from 'lucide-react'; // Placeholder icons

export function LiveAQI() {
    const city = cities[0];
    const color = getAQIColor(city.aqi);

    // Mock secondary data for the grid
    const pollutantGrid = [
        { label: 'PM2.5', value: city.pollutants.pm25, unit: 'µg/m³', icon: CloudRain },
        { label: 'PM10', value: city.pollutants.pm10, unit: 'µg/m³', icon: CloudRain },
        { label: 'NO₂', value: city.pollutants.no2, unit: 'ppb', icon: Wind },
        { label: 'SO₂', value: city.pollutants.so2, unit: 'ppb', icon: Droplets },
        { label: 'CO', value: '450', unit: 'ppb', icon: Thermometer }, // Mock
        { label: 'Ozone', value: '45', unit: 'ppb', icon: Thermometer }, // Mock
    ];

    return (
        <div className={styles.container}>
            {/* 
        Reference Layout Structure:
        1. Main Card (Floating)
          - Header: Location, Date
          - Hero: Big Number Left, Status Right
          - Sub-Hero: PM2.5 / PM10 specific row 
          - Grid: 3-column grid of other pollutants
      */}

            <FloatingElement depth={0.2} className={styles.mainCard}>
                {/* Header Row */}
                <div className={styles.cardHeader}>
                    <div>
                        <h1 className={styles.locationTitle}>{city.name}, India</h1>
                        <span className={styles.lastUpdated}>Real-time Air Quality Index</span>
                    </div>
                    <div className={styles.liveIndicator}>
                        <span className={styles.blinkDot} /> LIVE
                    </div>
                </div>

                <div className={styles.divider} />

                {/* Hero Section */}
                <div className={styles.heroSection}>
                    <div className={styles.heroLeft}>
                        <div className={styles.aqiGroup}>
                            <span className={styles.aqiLabel}>AQI (US)</span>
                            <div className={styles.heroValue} style={{ color }}>
                                {city.aqi}
                            </div>
                        </div>
                        {/* Primary Pollutants Row (PM2.5/10) */}
                        <div className={styles.primaryPollutants}>
                            <div className={styles.miniStat}>
                                <span className={styles.miniLabel}>PM2.5</span>
                                <span className={styles.miniValue}>{city.pollutants.pm25}</span>
                            </div>
                            <div className={styles.miniStat}>
                                <span className={styles.miniLabel}>PM10</span>
                                <span className={styles.miniValue}>{city.pollutants.pm10}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.heroRight}>
                        <div
                            className={styles.statusBadge}
                            style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}60` }}
                        >
                            {city.status}
                        </div>
                        <div className={styles.healthMsg}>
                            Health effects can be immediately felt by sensitive groups.
                        </div>
                    </div>
                </div>

                {/* Pollutants Grid */}
                <div className={styles.pollutantsGrid}>
                    {pollutantGrid.map((p, i) => (
                        <div key={p.label} className={styles.gridItem}>
                            <div className={styles.gridHeader}>
                                <p.icon size={16} className={styles.gridIcon} style={{ color: color }} />
                                <span className={styles.gridLabel}>{p.label}</span>
                            </div>
                            <div className={styles.gridValueGroup}>
                                <span className={styles.gridValue}>{p.value}</span>
                                <span className={styles.gridUnit}>{p.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AQI Scale Bar */}
                <div className={styles.scaleBarContainer}>
                    <div className={styles.scaleBar}>
                        <div className={styles.scaleSegment} style={{ background: '#00e400', flex: 1 }} />
                        <div className={styles.scaleSegment} style={{ background: '#ffff00', flex: 1 }} />
                        <div className={styles.scaleSegment} style={{ background: '#ff7e00', flex: 1 }} />
                        <div className={styles.scaleSegment} style={{ background: '#ff0000', flex: 1 }} />
                        <div className={styles.scaleSegment} style={{ background: '#8f3f97', flex: 1 }} />
                        <div className={styles.scaleSegment} style={{ background: '#7e0023', flex: 1 }} />
                    </div>
                    {/* Needle position calc: 300 is max scale generally for calc simplicity */}
                    <div
                        className={styles.needle}
                        style={{ left: `${Math.min((city.aqi / 400) * 100, 100)}%` }}
                    />
                </div>

            </FloatingElement>
        </div>
    );
}
