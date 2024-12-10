import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReasonsPagination from '@/sections/componentStyles/ReasonsPagination';
import bgVideo from '@/sections/assets/particles.mp4';

function Introduction() {
    const [showReasons, setShowReasons] = useState(false);

    return (
        <AnimatePresence>
            <motion.div
                key="intro"
                className="relative min-h-screen w-full overflow-hidden"
            >
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source
                        src={bgVideo}
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                {/* Content Container */}
                <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-12">
                    <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center">
                        {/* Hero Section */}
                        <AnimatePresence mode="wait">
                            {!showReasons ? (
                                <motion.div
                                    key="hero"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-center mb-8 md:mb-12 lg:mb-16"
                                >
                                    <h1 className="flex flex-col items-center font-semibold text-white tracking-tight mb-4 md:mb-6">
                                        <span className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl mb-2">Leading the Future of</span>
                                        <span className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            Attendance
                                        </span>
                                    </h1>

                                    <p className="text-base sm:text-lg lg:text-xl text-gray-200 font-medium leading-relaxed max-w-[90%] sm:max-w-2xl lg:max-w-3xl mx-auto mb-6 md:mb-8 lg:mb-10">
                                        Leading the future of attendance means redefining how we connect, engage, and innovate to create seamless and impactful experiences.
                                    </p>

                                    <motion.button
                                        onClick={() => setShowReasons(true)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium text-white bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-xl hover:bg-white/20 transition-all duration-500 w-full max-w-[200px]"
                                    >
                                        <span>Explore More</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <ReasonsPagination onClose={() => setShowReasons(false)} />
                            )}
                        </AnimatePresence>

                        {/* Stats Section */}
                        {!showReasons && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4"
                            >
                                {[
                                    { number: '99%', label: 'Attendance Accuracy' },
                                    { number: '100M+', label: 'Students Tracked' },
                                    { number: '100K+', label: 'Schools Trust Us' }
                                ].map((stat, index) => (
                                    <div
                                        key={index}
                                        className="relative group w-full"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10 text-center transform transition-transform duration-500 group-hover:scale-[1.02] h-full">
                                            <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-2">{stat.number}</div>
                                            <div className="text-sm sm:text-base lg:text-lg text-gray-200 font-medium">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default Introduction;