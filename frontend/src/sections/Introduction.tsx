import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReasonsPagination from '@/sections/componentStyles/ReasonsPagination';
import bgVideo from '@/sections/assets/moviebg.mp4';

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
                <div className="relative min-h-screen flex flex-col items-center justify-center">
                    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                        {/* Hero Section */}
                        <AnimatePresence mode="wait">
                            {!showReasons ? (
                                <motion.div
                                    key="hero"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-center mb-16 lg:mb-20"
                                >
                                    <h1 className="inline-flex flex-col items-center font-semibold text-white tracking-tight mb-8">
                                        <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-2">Attendance</span>
                                        <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            Reimagined
                                        </span>
                                    </h1>

                                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium leading-relaxed max-w-2xl lg:max-w-3xl mx-auto mb-10 lg:mb-12">
                                        Experience the future of educational management with our intelligent attendance system.
                                    </p>

                                    <motion.button
                                        onClick={() => setShowReasons(true)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-medium text-white bg-white/10 rounded-2xl backdrop-blur-xl hover:bg-white/20 transition-all duration-500"
                                    >
                                        <span>Discover Why</span>
                                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-500" />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
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
                                className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                            >
                                {[
                                    { number: '98%', label: 'Attendance Accuracy' },
                                    { number: '50k+', label: 'Students Tracked' },
                                    { number: '200+', label: 'Schools Trust Us' }
                                ].map((stat, index) => (
                                    <div
                                        key={index}
                                        className="relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 text-center transform transition-transform duration-500 group-hover:scale-[1.02]">
                                            <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-2 sm:mb-3">{stat.number}</div>
                                            <div className="text-base sm:text-lg text-gray-200 font-medium">{stat.label}</div>
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