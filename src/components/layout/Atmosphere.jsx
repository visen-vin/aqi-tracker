import { motion } from 'framer-motion';

export function Atmosphere() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0B0F19]">
            {/* Grain Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Animated Blobs */}
            <motion.div
                className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]"
                animate={{
                    x: [0, 50, -30, 0],
                    y: [0, -30, 50, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <motion.div
                className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px]"
                animate={{
                    x: [0, -40, 20, 0],
                    y: [0, 40, -40, 0],
                    scale: [1, 1.05, 0.9, 1],
                }}
                transition={{
                    duration: 45,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <motion.div
                className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[100px]"
                animate={{
                    x: [0, 30, -20, 0],
                    y: [0, 20, -30, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 50,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    );
}
