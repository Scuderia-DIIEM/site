import React from 'react'
import { motion } from 'framer-motion'

interface ScrollIndicatorProps {
    className?: string
    delay?: number
}

export default function ScrollIndicator({ className = '', delay = 0.8 }: ScrollIndicatorProps) {
    return (
        <motion.div
            className={`flex justify-center ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.8 }}
        >
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </motion.div>
        </motion.div>
    )
}

