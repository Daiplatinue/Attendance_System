import { AppSidebar } from "@/components/app-sidebar-parent"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Search, Crown, Award, Calendar, ChevronUp, ChevronDown, Minus } from 'lucide-react'
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import axios from "axios"

interface Student {
    u_id: string;
    u_fullname: string;
    u_department: string;
    u_profile: string;
    a_total: number;
    previousRank?: number;
    currentRank?: number;
    trend?: string;
    difference?: number;
}

interface Rankings {
    [key: string]: number;
}

export default function ViewLeaderboard() {
    const [leaderboardData, setLeaderboardData] = useState<Student[]>([]);
    const [error, setError] = useState("");
    const [previousRankings, setPreviousRankings] = useState<Rankings>({});

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/leaderboard');
                const sortedData = response.data.sort((a: Student, b: Student) => b.a_total - a.a_total);

                // Calculate trends based on position changes
                const dataWithTrends = sortedData.map((student: Student, currentIndex: number) => {
                    const previousRank = previousRankings[student.u_id] || currentIndex;
                    const rankDifference = previousRank - currentIndex;

                    return {
                        ...student,
                        previousRank: previousRank,
                        currentRank: currentIndex,
                        trend: rankDifference === 0 ? "same" : rankDifference < 0 ? "down" : "up",
                        difference: Math.abs(rankDifference)
                    };
                });

                // Update previous rankings for next comparison
                const newRankings: Rankings = {};
                dataWithTrends.forEach((student: Student, index: number) => {
                    newRankings[student.u_id] = index;
                });
                setPreviousRankings(newRankings);

                setLeaderboardData(dataWithTrends);
            } catch (err) {
                setError("Failed to fetch leaderboard data");
            }
        };

        // Fetch data initially and then every 30 seconds
        fetchLeaderboardData();
        const interval = setInterval(fetchLeaderboardData, 30000);

        return () => clearInterval(interval);
    }, [previousRankings]);

    const getRankColor = (index: number): string => {
        switch (index) {
            case 0:
                return "text-green-400";
            case 1:
                return "text-gray-300";
            case 2:
                return "text-amber-600";
            default:
                return "text-white";
        }
    };

    const getTrendIcon = (trend: string, difference: number) => {
        if (trend === "up") {
            return (
                <div className="flex items-center gap-1 text-green-400">
                    <ChevronUp className="w-5 h-5" />
                    <span className="text-sm font-medium">+{difference}</span>
                </div>
            );
        }
        if (trend === "down") {
            return (
                <div className="flex items-center gap-1 text-red-400">
                    <ChevronDown className="w-5 h-5" />
                    <span className="text-sm font-medium">-{difference}</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1 text-gray-400">
                <Minus className="w-5 h-5" />
                <span className="text-sm font-medium">0</span>
            </div>
        );
    };

    const getTrophyIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Crown className="w-12 h-12 text-yellow-400 animate-pulse drop-shadow-glow" />;
            case 1:
                return <Trophy className="w-10 h-10 text-gray-300 drop-shadow-glow" />;
            case 2:
                return <Award className="w-10 h-10 text-amber-600 drop-shadow-glow" />;
            default:
                return null;
        }
    };

    const podiumVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.3,
                duration: 0.8,
                ease: "easeOut"
            }
        })
    };

    if (error) {
        return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
            <div className="text-red-400">{error}</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-modalColor text-white border-b border-white/10 backdrop-blur-lg bg-opacity-80">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink>
                                            <Link to={'/'}>Dashboard</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-white">Leaderboards</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    <div className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8'>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='bg-modalColor rounded-xl shadow-2xl p-6 border border-gray-800 backdrop-blur-md'
                        >
                            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className='flex flex-col gap-2'
                                >
                                    <h2 className='text-2xl md:text-3xl font-bold flex items-center gap-3 text-white'>
                                        <Trophy className="w-8 h-8 text-yellow-400" />
                                        Attendance Champions
                                    </h2>
                                    <p className="text-blue-300 flex items-center gap-2">
                                        Academic Year 2023-2024
                                    </p>
                                </motion.div>
                                <div className='relative flex-grow md:flex-grow-0'>
                                    <input
                                        type="text"
                                        placeholder="Search students"
                                        className='w-full md:w-72 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/5 text-white placeholder-gray-400 border border-gray-800 transition-all duration-300 hover:bg-white/10'
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                            </div>

                            {/* Top 3 Podium */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative">
                                {/* Silver - 2nd Place */}
                                {leaderboardData[1] && (
                                    <motion.div
                                        custom={1}
                                        initial="hidden"
                                        animate="visible"
                                        variants={podiumVariants}
                                        className="md:mt-8"
                                    >
                                        <div className="flex flex-col items-center p-6 bg-gradient-to-b from-gray-300/20 to-white/5 rounded-2xl border border-gray-800 transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
                                            <div className="mb-4 animate-bounce">
                                                {getTrophyIcon(1)}
                                            </div>
                                            <Avatar className="h-20 w-20 mb-4 ring-4 ring-gray-300 shadow-2xl">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboardData[1].u_fullname}`} />
                                                <AvatarFallback>{leaderboardData[1].u_fullname.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <p className="text-white font-bold text-lg text-center mb-1">{leaderboardData[1].u_fullname}</p>
                                            <p className="text-gray-400 text-sm mb-3">{leaderboardData[1].u_department}</p>
                                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                                <span className="text-gray-300 font-semibold">{leaderboardData[1].a_total}</span>
                                                <span className="text-gray-400 text-sm">days</span>
                                            </div>
                                            <div className="mt-2">
                                                {getTrendIcon(leaderboardData[1].trend || "same", leaderboardData[1].difference || 0)}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Gold - 1st Place */}
                                {leaderboardData[0] && (
                                    <motion.div
                                        custom={0}
                                        initial="hidden"
                                        animate="visible"
                                        variants={podiumVariants}
                                        className="md:order-1"
                                    >
                                        <div className="flex flex-col items-center p-8 bg-gradient-to-b from-yellow-400/20 via-yellow-600/10 to-yellow-900/5 rounded-2xl border border-yellow-500 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl shadow-yellow-400/20">
                                            <div className="mb-4 animate-bounce">
                                                {getTrophyIcon(0)}
                                            </div>
                                            <Avatar className="h-24 w-24 mb-4 ring-4 ring-yellow-400 shadow-2xl">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboardData[0].u_fullname}`} />
                                                <AvatarFallback>{leaderboardData[0].u_fullname.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <p className="text-yellow-400 font-bold text-xl text-center mb-1">{leaderboardData[0].u_fullname}</p>
                                            <p className="text-yellow-300/80 text-sm mb-4">{leaderboardData[0].u_department}</p>
                                            <div className="flex items-center gap-2 bg-yellow-400/20 px-5 py-2.5 rounded-full">
                                                <span className="text-yellow-400 font-bold text-lg">{leaderboardData[0].a_total}</span>
                                                <span className="text-yellow-300/80 text-sm">days</span>
                                            </div>
                                            <div className="mt-2">
                                                {getTrendIcon(leaderboardData[0].trend || "same", leaderboardData[0].difference || 0)}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Bronze - 3rd Place */}
                                {leaderboardData[2] && (
                                    <motion.div
                                        custom={2}
                                        initial="hidden"
                                        animate="visible"
                                        variants={podiumVariants}
                                        className="md:mt-16"
                                    >
                                        <div className="flex flex-col items-center p-6 bg-gradient-to-b from-amber-600/20 to-amber-800/5 rounded-2xl border border-amber-600/20 transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
                                            <div className="mb-4 animate-bounce">
                                                {getTrophyIcon(2)}
                                            </div>
                                            <Avatar className="h-20 w-20 mb-4 ring-4 ring-amber-600 shadow-2xl">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboardData[2].u_fullname}`} />
                                                <AvatarFallback>{leaderboardData[2].u_fullname.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <p className="text-white font-bold text-lg text-center mb-1">{leaderboardData[2].u_fullname}</p>
                                            <p className="text-amber-400/80 text-sm mb-3">{leaderboardData[2].u_department}</p>
                                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                                <span className="text-amber-400 font-semibold">{leaderboardData[2].a_total}</span>
                                                <span className="text-amber-400/80 text-sm">days</span>
                                            </div>
                                            <div className="mt-2">
                                                {getTrendIcon(leaderboardData[2].trend || "same", leaderboardData[2].difference || 0)}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Leaderboard Table */}
                            <div className="overflow-x-auto rounded-xl border border-white/10">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-white/5">
                                            <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                                            <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                                            <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                                            <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Attendance</th>
                                            <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {leaderboardData.map((student: Student, index: number) => (
                                            <motion.tr
                                                key={student.u_id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="hover:bg-white/5 transition-colors"
                                            >
                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-bold text-lg ${getRankColor(index)}`}>
                                                            #{index + 1}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Avatar className="h-10 w-10 ring-2 ring-white/10">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.u_fullname}`} />
                                                            <AvatarFallback>{student.u_fullname.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-white">{student.u_fullname}</div>
                                                            <div className="text-sm text-gray-400">SCC-0-{student.u_id.toString().padStart(6, '0')}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.u_department}</td>
                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2 min-w-[100px]">
                                                            <Calendar className="w-4 h-4 text-blue-400" />
                                                            <span className="text-white font-medium">{student.a_total}</span>
                                                            <span className="text-gray-400 text-sm">days</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                    {getTrendIcon(student.trend || "same", student.difference || 0)}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}