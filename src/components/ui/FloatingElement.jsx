import { motion } from 'framer-motion';

export function FloatingElement({
    children,
    depth = 1,
    className = '',
    delay = 0
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.8,
                    delay: delay,
                    ease: "easeOut"
                }
            }}
            whileHover={{
                scale: 1.02,
                y: -5,
                transition: { type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.95 }}
            style={{
                zIndex: Math.floor(depth * 10)
            }}
        >
            <motion.div
                animate={{
                    y: [0, -10 * depth, 0],
                }}
                transition={{
                    duration: 4 + depth,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
