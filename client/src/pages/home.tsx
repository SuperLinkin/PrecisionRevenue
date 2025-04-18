import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { FeatureCard } from '@/components/ui/feature-card';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { motion } from 'framer-motion';
import { 
  DollarSignIcon, 
  FileTextIcon, 
  ClipboardCheckIcon, 
  LineChartIcon
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'REMY',
      description: 'Revenue Management System that handles complex recognition rules and schedules.',
      icon: <DollarSignIcon className="h-6 w-6 text-secondary" />,
      features: [
        'Automated revenue schedules',
        'IFRS 15/ASC 606 compliance',
        'Multi-currency support'
      ]
    },
    {
      title: 'CLAUS',
      description: 'AI-powered Contract Legal Analysis Utility System that reads, analyzes, and generates legal contracts.',
      icon: <FileTextIcon className="h-6 w-6 text-secondary" />,
      features: [
        'Advanced contract parsing & generation',
        'Automated performance obligation extraction',
        'AI-driven risk assessment & flagging'
      ]
    },
    {
      title: 'MOCA',
      description: 'Modelling & Optimization for Comprehensive Analytics - an intelligent forecasting and revenue modeling tool.',
      icon: <ClipboardCheckIcon className="h-6 w-6 text-secondary" />,
      features: [
        'Predictive revenue forecasting',
        'AI scenario modeling & simulation',
        'Pattern recognition for optimization'
      ]
    },
    {
      title: 'NOVA',
      description: 'Next-gen Operational Visualization Analytics - your intelligent CFO dashboard with advanced KPI insights.',
      icon: <LineChartIcon className="h-6 w-6 text-secondary" />,
      features: [
        'Real-time KPI monitoring & alerts',
        'AI-generated financial insights',
        'Adaptive visualization intelligence'
      ]
    }
  ];

  // AI capabilities showcase data
  const aiCapabilities = [
    {
      title: "Advanced Contract Analysis",
      description: "Our proprietary natural language processing models understand complex legal language with human-level comprehension.",
      icon: "🧠",
      stats: {
        accuracy: "98.7%",
        speedImprovement: "85%",
        dataPoints: "10K+"
      }
    },
    {
      title: "Predictive Revenue Modeling",
      description: "Advanced machine learning algorithms analyze historical data to forecast revenue with unprecedented accuracy.",
      icon: "📊",
      stats: {
        accuracy: "95.4%",
        speedImprovement: "70%",
        dataPoints: "25K+"
      }
    },
    {
      title: "Adaptive Financial Intelligence",
      description: "Self-learning optimization systems that continuously improve your financial processes and compliance.",
      icon: "🔄",
      stats: {
        accuracy: "99.3%",
        speedImprovement: "90%",
        dataPoints: "15K+"
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary-900 to-primary-950 text-white overflow-hidden">
        {/* Futuristic patterns and effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
               }}
          ></div>
          
          {/* Animated network visualization effect */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute h-2 w-2 rounded-full bg-blue-500 top-1/4 left-1/4 animate-pulse"></div>
            <div className="absolute h-2 w-2 rounded-full bg-blue-500 top-3/4 left-1/3 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute h-2 w-2 rounded-full bg-blue-500 top-1/2 left-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute h-2 w-2 rounded-full bg-blue-500 top-1/3 left-2/3 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute h-2 w-2 rounded-full bg-blue-500 top-2/3 left-3/4 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="hidden md:block absolute w-[1px] h-[100px] bg-gradient-to-b from-transparent via-blue-500 to-transparent top-1/4 left-1/4 rotate-45"></div>
            <div className="hidden md:block absolute w-[1px] h-[150px] bg-gradient-to-b from-transparent via-blue-500 to-transparent top-1/2 left-1/3 -rotate-45"></div>
            <div className="hidden md:block absolute w-[1px] h-[120px] bg-gradient-to-b from-transparent via-blue-500 to-transparent top-1/3 left-1/2 rotate-12"></div>
            <div className="hidden md:block absolute w-[1px] h-[80px] bg-gradient-to-b from-transparent via-blue-500 to-transparent top-2/3 left-2/3 -rotate-12"></div>
          </div>
          
          {/* Glow effects */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-200 ring-1 ring-inset ring-blue-500/40 mb-6">
                <svg className="w-4 h-4 mr-1 text-blue-400 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                AI-Powered Financial Intelligence
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent pb-1">
                Precision Revenue Automation
              </h1>
              
              <p className="mt-6 text-xl max-w-3xl text-blue-100">
                Revolutionize your financial operations with our state-of-the-art <span className="font-semibold text-white">advanced revenue recognition</span>, 
                <span className="font-semibold text-white"> AI contract analysis</span>, and <span className="font-semibold text-white">intelligent forecasting</span>.
              </p>
              
              <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:gap-5">
                <Link href="/signup">
                  <Button className="group w-full sm:w-auto overflow-hidden relative rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 shadow-lg transition-all duration-300 border border-white/10">
                    <span className="relative z-10 font-medium flex items-center">
                      Experience the AI Advantage
                      <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <span className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-15 transition-all group-hover:left-full duration-1000 ease-out"></span>
                  </Button>
                </Link>
                
                <Link href="/knowledge-center">
                  <Button variant="outline" className="w-full sm:w-auto rounded-full border-white/30 text-white hover:bg-white/10 px-8 py-4 transition-all duration-300">
                    <span className="font-medium">Explore Capabilities</span>
                  </Button>
                </Link>
              </div>
              
              {/* AI badges */}
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-500/30">
                  Deep Learning
                </div>
                <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-200 ring-1 ring-inset ring-purple-500/30">
                  Machine Learning
                </div>
                <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-200 ring-1 ring-inset ring-blue-500/30">
                  Predictive Analytics
                </div>
              </div>
            </div>
            
            <div className="mt-16 lg:mt-0 relative">
              {/* Futuristic UI dashboard mockup */}
              <div className="relative mx-auto perspective-1000">
                <div className="relative z-10 rounded-xl p-1 shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 transform transition-transform duration-700 hover:translate-y-[-10px] hover:rotate-y-12">
                  <div className="bg-primary-900/90 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
                    <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="flex items-center text-xs text-blue-200 font-medium">
                        <svg className="w-4 h-4 mr-1 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4.93 19.07L6.34 17.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.66 6.34L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        ADVANCED REVENUE AI INTERFACE
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-4 h-4 rounded-full bg-blue-500/30 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                        </div>
                        <div className="w-4 h-4 rounded-full bg-blue-500/30 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-5">
                      {/* REMY Contract Analysis Interface */}
                      <div className="rounded-lg bg-gradient-to-b from-primary-800/40 to-primary-900/40 border border-white/5 p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm font-bold text-white flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                            REMY Contract Analysis
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            <div className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></div>
                              Online
                            </div>
                          </div>
                        </div>
                        
                        {/* Contract Drop Zone */}
                        <motion.div 
                          className="relative h-24 mb-3 rounded-lg border border-dashed border-blue-500/40 bg-blue-500/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                          whileHover={{ 
                            borderColor: "rgba(59, 130, 246, 0.7)",
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            <motion.div 
                              className="absolute inset-0 -z-10"
                              animate={{ 
                                backgroundPosition: ["0% 0%", "100% 100%"],
                                transition: { 
                                  repeat: Infinity, 
                                  repeatType: "mirror", 
                                  duration: 5,
                                  ease: "linear"
                                }
                              }}
                              style={{
                                backgroundImage: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 10%, transparent 10.5%)",
                                backgroundSize: "20px 20px"
                              }}
                            />
                          </motion.div>
                          
                          <motion.div 
                            className="text-blue-300"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2,
                              ease: "easeInOut"
                            }}
                          >
                            <svg className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 16.2091 19.2091 18 17 18H7C4.79086 18 3 16.2091 3 14C3 11.7909 4.79086 10 7 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 12V15M12 15L14 13M12 15L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.div>
                          <div className="text-sm font-medium text-blue-200">Drag & Drop Contract</div>
                          <div className="text-xs text-blue-300/70 mt-1">or click to upload PDF</div>
                        </motion.div>
                        
                        {/* REMY Chat Interface */}
                        <div className="rounded-lg border border-white/10 overflow-hidden">
                          <div className="bg-gradient-to-r from-primary-900/80 to-primary-800/80 px-4 py-2.5 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                            <div className="font-medium text-sm text-white">REMY <span className="opacity-50 text-xs">| Your Contract Assistant</span></div>
                          </div>
                          
                          <motion.div 
                            className="bg-primary-900/60 p-3 space-y-3 h-[150px] overflow-y-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            {/* Chat Messages */}
                            <motion.div 
                              className="flex items-start gap-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5, duration: 0.3 }}
                            >
                              <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-xs font-bold text-blue-300">R</span>
                              </div>
                              <div className="bg-primary-800/40 rounded-lg p-2 text-sm text-white max-w-[85%]">
                                Hello! I'm REMY, your contract analysis assistant. Drop your contract and ask me anything about its terms and compliance.
                              </div>
                            </motion.div>
                            
                            <motion.div 
                              className="flex items-start justify-end gap-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8, duration: 0.3 }}
                            >
                              <div className="bg-blue-600/20 rounded-lg p-2 text-sm text-white max-w-[85%]">
                                Does this contract have a significant financing component?
                              </div>
                              <div className="w-6 h-6 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-xs font-bold text-purple-300">U</span>
                              </div>
                            </motion.div>
                            
                            <motion.div 
                              className="flex items-start gap-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.1, duration: 0.3 }}
                            >
                              <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-xs font-bold text-blue-300">R</span>
                              </div>
                              <div className="bg-primary-800/40 rounded-lg p-2 text-sm text-white max-w-[85%]">
                                <p className="font-semibold text-blue-300">Yes</p>
                                <p className="mt-1">This contract contains a significant financing component in section 4.3. The payment terms extend beyond 12 months with no explicit interest rate, which under IFRS 15/ASC 606 requires separate accounting for the time value of money.</p>
                                <div className="mt-2 text-xs text-blue-200 border-t border-blue-500/20 pt-1 flex justify-between">
                                  <span>Confidence: 96.8%</span>
                                  <span>References: Sec 4.3, 7.2</span>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                          
                          <div className="bg-primary-900/80 p-2 border-t border-white/5">
                            <div className="relative">
                              <input 
                                type="text" 
                                className="w-full bg-white/5 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50" 
                                placeholder="Ask about contract terms, compliance, risks..."
                              />
                              <motion.button 
                                className="absolute right-1 top-1 rounded-full p-1.5 bg-blue-600 text-white"
                                whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* REMY Metrics */}
                      <div className="relative">
                        {/* REMY Badge */}
                        <div className="absolute -top-4 -left-4 flex items-center justify-center z-10">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-md"></div>
                            <motion.div 
                              className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs px-3 py-1 rounded-full border border-white/10 shadow-lg"
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
                            >
                              REMY
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <motion.div 
                            className="rounded-lg bg-gradient-to-br from-blue-500/20 to-primary-800/40 border border-white/5 p-3 relative overflow-hidden"
                            whileHover={{ 
                              boxShadow: "0 0 20px 2px rgba(59, 130, 246, 0.2)",
                              borderColor: "rgba(255, 255, 255, 0.2)"
                            }}
                          >
                            <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-blue-500/10 blur-xl"></div>
                            <div className="flex items-center mb-1">
                              <svg className="w-3 h-3 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10M20.618 5.984C20.209 5.38887 19.6547 4.88743 19.0091 4.53089C18.3635 4.17435 17.6451 3.97439 16.9125 3.94673C16.1798 3.91907 15.4493 4.06456 14.78 4.37229C14.1108 4.68002 13.5214 5.14023 13.0729 5.712M21 10V14C21 16.2091 16.9706 18 12 18C7.02944 18 3 16.2091 3 14V10C3 7.79086 7.02944 6 12 6C16.9706 6 21 7.79086 21 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <div className="text-xs text-white/80">REMY Accuracy</div>
                            </div>
                            <div className="text-xl font-bold text-white">98.7%</div>
                            <div className="text-xs text-emerald-400 flex items-center mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                              +1.2%
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="rounded-lg bg-gradient-to-br from-indigo-500/20 to-primary-800/40 border border-white/5 p-3 relative overflow-hidden"
                            whileHover={{ 
                              boxShadow: "0 0 20px 2px rgba(99, 102, 241, 0.2)",
                              borderColor: "rgba(255, 255, 255, 0.2)"
                            }}
                          >
                            <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-indigo-500/10 blur-xl"></div>
                            <div className="flex items-center mb-1">
                              <svg className="w-3 h-3 mr-2 text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <div className="text-xs text-white/80">Contracts Analyzed</div>
                            </div>
                            <div className="text-xl font-bold text-white">248</div>
                            <div className="text-xs text-emerald-400 flex items-center mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                              +24
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="rounded-lg bg-gradient-to-br from-violet-500/20 to-primary-800/40 border border-white/5 p-3 relative overflow-hidden"
                            whileHover={{ 
                              boxShadow: "0 0 20px 2px rgba(139, 92, 246, 0.2)",
                              borderColor: "rgba(255, 255, 255, 0.2)"
                            }}
                          >
                            <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-violet-500/10 blur-xl"></div>
                            <div className="flex items-center mb-1">
                              <svg className="w-3 h-3 mr-2 text-violet-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12.75L11.25 15L15 9.75M8 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V17M16 4H18C18.5523 4 19 4.44772 19 5V13M16 4V9C16 9.55228 15.5523 10 15 10H10C9.44772 10 9 9.55228 9 9V4M16 4H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <div className="text-xs text-white/80">Audit-Ready Score</div>
                            </div>
                            <div className="text-xl font-bold text-white">97.3%</div>
                            <div className="text-xs text-emerald-400 flex items-center mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                              +2.8%
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements for depth */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 rounded-full blur-2xl"></div>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-2xl"></div>
                
                {/* Network node animation */}
                <div className="absolute -top-4 -left-4 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 -right-4 w-2 h-2 bg-indigo-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-4 left-1/2 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="relative overflow-hidden">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-blue-50/70 to-indigo-50/60"></div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-indigo-200/30 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 w-72 h-72 rounded-full bg-purple-200/20 blur-3xl"></div>
          
          {/* Subtle patterns */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ 
            backgroundImage: 'radial-gradient(rgba(79, 70, 229, 0.25) 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }}></div>
          
          {/* Light wave pattern */}
          <div className="absolute inset-0 opacity-[0.05]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="wave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0,50 C20,30 40,70 60,40 C80,10 100,50 100,50" stroke="#4F46E5" strokeWidth="1" fill="none" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#wave-pattern)" />
            </svg>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:py-32 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            <motion.span 
              className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary ring-1 ring-inset ring-secondary/30 mb-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <svg className="mr-1 h-1.5 w-1.5 fill-secondary animate-pulse" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
              AI-Powered Platform
            </motion.span>
            <motion.h2 
              className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Our Comprehensive Solution Suite
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-neutral font-light max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              PRA's integrated tools work together to streamline your financial operations with advanced AI and automation technologies.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100,
                      damping: 12 
                    } 
                  }
                }}
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  features={feature.features}
                  icon={feature.icon}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Interactive Module Showcase Section */}
      <div className="relative bg-gradient-to-b from-indigo-50/70 via-blue-50/60 to-primary-50/80 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%234F46E5\' fill-opacity=\'0.15\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")',
               }}>
          </div>
          <div className="absolute -top-40 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-purple-300/10 via-indigo-300/10 to-blue-300/10 blur-3xl"></div>
          <div className="absolute bottom-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-blue-300/10 via-cyan-300/10 to-teal-300/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:py-32 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 ring-1 ring-inset ring-indigo-400/30 mb-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <svg className="mr-1 h-1.5 w-1.5 fill-indigo-500 animate-pulse" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
              Interactive Platform
            </motion.span>
            <motion.h2 
              className="text-4xl font-bold bg-gradient-to-r from-primary-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent pb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Powerful Modules That Transform Revenue Operations
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-gray-600 font-light max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Our suite of specialized tools work together seamlessly to automate, analyze, and optimize your entire revenue process from contract negotiation to financial reporting.
            </motion.p>
          </motion.div>
          
          {/* CLAUS: Legal AI Agent */}
          <motion.div 
            className="mb-24 bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: 0.7,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* CLAUS Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                    <motion.svg 
                      className="w-6 h-6" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      animate={{ rotateY: [0, 360] }}
                      transition={{ 
                        duration: 3, 
                        ease: "easeInOut", 
                        repeat: Infinity, 
                        repeatDelay: 5
                      }}
                    >
                      <path d="M12 14V22M12 14L10 12M12 14L14 12M7.24 10.2627C6.16365 9.71614 5.37804 8.76443 5.08414 7.64757C4.79024 6.53071 5.01611 5.34016 5.70211 4.39594C6.3881 3.45173 7.47299 2.84892 8.64304 2.73952C9.8131 2.63013 10.9825 3.0249 11.8438 3.82252C11.9371 3.91054 12.0633 3.91054 12.1566 3.82252C13.0179 3.0249 14.1873 2.63013 15.3573 2.73952C16.5274 2.84892 17.6123 3.45173 18.2983 4.39594C18.9843 5.34016 19.2101 6.53071 18.9162 7.64757C18.6223 8.76443 17.8367 9.71614 16.7604 10.2627C15.6602 10.8232 14.8518 11.838 14.5588 13.0434C14.5196 13.1971 14.4141 13.3255 14.2713 13.3944C14.1285 13.4634 13.9631 13.4657 13.8183 13.4007C13.1965 13.1352 12.5371 12.9999 11.87 13.0001C11.2007 13.0003 10.5399 13.1367 9.91704 13.4033C9.77181 13.4689 9.60575 13.4667 9.46251 13.3974C9.31927 13.3282 9.21359 13.1991 9.17467 13.0447C8.88033 11.839 8.07043 10.8239 6.969 10.264" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </div>
                  <div>
                    <div className="text-xs text-indigo-600 font-semibold tracking-wide uppercase">Legal Contract AI</div>
                    <h3 className="text-2xl font-bold text-gray-900">CLAUS</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Our Contract Legal Analysis & Unified System (CLAUS) transforms contract creation, review, and compliance through advanced clause analysis and generation tailored to your business rules.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">IFRS 15/ASC 606 Compliant</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Risk Assessment</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Clause Library</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Automated Redlining</p>
                  </div>
                </div>
                
                <motion.button 
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-fit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Explore CLAUS</span>
                  <svg className="ml-2 -mr-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
              
              {/* CLAUS Interactive Demo */}
              <div className="relative bg-gradient-to-br from-indigo-50 to-blue-50 p-6 lg:p-8">
                <div className="absolute top-0 right-0 h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
                <div className="absolute bottom-0 left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-sm font-medium text-gray-500">CLAUS Contract Editor</div>
                    <div className="w-6"></div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="text-sm font-medium text-gray-700 mb-2">SaaS Contract Clause Builder</div>
                    
                    {/* Draggable Clauses */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <motion.div 
                        className="bg-indigo-50 rounded-md p-2 border border-indigo-100 cursor-grab"
                        whileHover={{ 
                          backgroundColor: "#e0e7ff", 
                          y: -2,
                          boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.1)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        drag
                        dragConstraints={{
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0
                        }}
                      >
                        <div className="text-xs font-medium text-indigo-700">Standard Payment Terms</div>
                        <div className="text-xs text-gray-500 mt-1">Net-30 payment schedule</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-blue-50 rounded-md p-2 border border-blue-100 cursor-grab"
                        whileHover={{ 
                          backgroundColor: "#dbeafe", 
                          y: -2,
                          boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.1)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        drag
                        dragConstraints={{
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0
                        }}
                      >
                        <div className="text-xs font-medium text-blue-700">Usage-Based Pricing</div>
                        <div className="text-xs text-gray-500 mt-1">Tiered consumption pricing</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-purple-50 rounded-md p-2 border border-purple-100 cursor-grab"
                        whileHover={{ 
                          backgroundColor: "#f3e8ff", 
                          y: -2,
                          boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.1)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        drag
                        dragConstraints={{
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0
                        }}
                      >
                        <div className="text-xs font-medium text-purple-700">Service Level Agreement</div>
                        <div className="text-xs text-gray-500 mt-1">99.9% uptime guarantee</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-cyan-50 rounded-md p-2 border border-cyan-100 cursor-grab"
                        whileHover={{ 
                          backgroundColor: "#ecfeff", 
                          y: -2,
                          boxShadow: "0 4px 6px -1px rgba(8, 145, 178, 0.1)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        drag
                        dragConstraints={{
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0
                        }}
                      >
                        <div className="text-xs font-medium text-cyan-700">Data Processing Terms</div>
                        <div className="text-xs text-gray-500 mt-1">GDPR compliance clause</div>
                      </motion.div>
                    </div>
                    
                    {/* Contract Preview with Before/After */}
                    <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-3 mb-3">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs font-medium text-gray-700">Contract Preview</div>
                        <div className="flex space-x-2">
                          <div className="text-xs px-2 py-1 bg-gray-200 rounded text-gray-700">Before</div>
                          <div className="text-xs px-2 py-1 bg-indigo-100 rounded text-indigo-700">After</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-800 mb-2 line-through">9.1 Payment terms are strictly due on receipt of invoice.</div>
                      <div className="text-xs text-indigo-700 mb-2 bg-indigo-50 p-1 rounded">9.1 Payment terms are net-30 from date of invoice issuance.</div>
                      
                      <div className="text-xs text-gray-800 mb-2">9.2 All fees are non-refundable.</div>
                      
                      <div className="text-xs text-gray-800 mb-2 line-through">9.3 Late payments will accrue interest at 2% per month.</div>
                      <div className="text-xs text-indigo-700 mb-2 bg-indigo-50 p-1 rounded">9.3 Late payments will accrue interest at 1.5% per month or the maximum rate permitted by law.</div>
                      
                      <div className="text-xs text-gray-400 italic mt-3">Drag clauses above to the contract to update terms...</div>
                    </div>
                    
                    {/* CLAUS Analysis */}
                    <div className="bg-indigo-50 rounded-md p-2 border border-indigo-100 mt-auto">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                          <span className="text-xs font-bold text-indigo-600">C</span>
                        </div>
                        <div className="text-xs font-medium text-indigo-800">CLAUS Analysis</div>
                      </div>
                      <div className="text-xs text-indigo-600 mt-1">Modified payment terms may impact revenue recognition timing under ASC 606.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* MOCA: Modeling & Forecasting */}
          <motion.div 
            className="mb-24 bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: 0.7,
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.1
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* MOCA Interactive Demo */}
              <div className="order-2 lg:order-1 relative bg-gradient-to-br from-blue-50 to-cyan-50 p-6 lg:p-8">
                <div className="absolute top-0 right-0 h-px w-1/2 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                <div className="absolute bottom-0 left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-sm font-medium text-gray-500">MOCA Scenario Builder</div>
                    <div className="w-6"></div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="text-sm font-medium text-gray-700 mb-4">Revenue Forecast Sandbox</div>
                    
                    {/* Forecast Inputs */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Churn Rate</label>
                        <div className="relative">
                          <motion.input 
                            type="range" 
                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer" 
                            defaultValue="5"
                            min="0"
                            max="20"
                            animate={{ boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0)", "0 0 0 4px rgba(59, 130, 246, 0.1)", "0 0 0 0 rgba(59, 130, 246, 0)"] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          />
                          <div className="absolute top-5 left-0 right-0 flex justify-between">
                            <span className="text-xs text-gray-500">0%</span>
                            <span className="text-xs text-gray-500">20%</span>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <span className="text-sm font-medium text-blue-600">5%</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">New Deals/Month</label>
                        <div className="relative">
                          <motion.input 
                            type="range" 
                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer" 
                            defaultValue="12"
                            min="0"
                            max="30"
                            animate={{ boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0)", "0 0 0 4px rgba(59, 130, 246, 0.1)", "0 0 0 0 rgba(59, 130, 246, 0)"] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.5 }}
                          />
                          <div className="absolute top-5 left-0 right-0 flex justify-between">
                            <span className="text-xs text-gray-500">0</span>
                            <span className="text-xs text-gray-500">30</span>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <span className="text-sm font-medium text-blue-600">12</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Revenue Chart */}
                    <div className="relative h-40 mb-4">
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gray-200"></div>
                      <div className="absolute inset-y-0 left-0 w-px bg-gray-200"></div>
                      
                      {/* Chart bars */}
                      <div className="absolute left-[5%] bottom-0 w-[7%] h-[25%] bg-blue-200 rounded-t"></div>
                      <div className="absolute left-[14%] bottom-0 w-[7%] h-[30%] bg-blue-300 rounded-t"></div>
                      <div className="absolute left-[23%] bottom-0 w-[7%] h-[38%] bg-blue-400 rounded-t"></div>
                      <div className="absolute left-[32%] bottom-0 w-[7%] h-[45%] bg-blue-500 rounded-t"></div>
                      <div className="absolute left-[41%] bottom-0 w-[7%] h-[55%] bg-blue-600 rounded-t"></div>
                      <div className="absolute left-[50%] bottom-0 w-[7%] h-[65%] bg-blue-700 rounded-t"></div>
                      
                      {/* Projected (animated) */}
                      <motion.div 
                        className="absolute left-[59%] bottom-0 w-[7%] rounded-t bg-gradient-to-t from-indigo-500 to-indigo-400"
                        initial={{ height: "0%" }}
                        animate={{ height: "72%" }}
                        transition={{ duration: 1.5, delay: 1 }}
                      ></motion.div>
                      <motion.div 
                        className="absolute left-[68%] bottom-0 w-[7%] rounded-t bg-gradient-to-t from-indigo-500 to-indigo-400"
                        initial={{ height: "0%" }}
                        animate={{ height: "80%" }}
                        transition={{ duration: 1.5, delay: 1.2 }}
                      ></motion.div>
                      <motion.div 
                        className="absolute left-[77%] bottom-0 w-[7%] rounded-t bg-gradient-to-t from-indigo-500 to-indigo-400"
                        initial={{ height: "0%" }}
                        animate={{ height: "85%" }}
                        transition={{ duration: 1.5, delay: 1.4 }}
                      ></motion.div>
                      <motion.div 
                        className="absolute left-[86%] bottom-0 w-[7%] rounded-t bg-gradient-to-t from-indigo-500 to-indigo-400"
                        initial={{ height: "0%" }}
                        animate={{ height: "92%" }}
                        transition={{ duration: 1.5, delay: 1.6 }}
                      ></motion.div>
                      
                      {/* Labels */}
                      <div className="absolute bottom-[-20px] left-[23%] text-xs text-gray-500">Q1</div>
                      <div className="absolute bottom-[-20px] left-[50%] text-xs text-gray-500">Q2</div>
                      <div className="absolute bottom-[-20px] left-[77%] text-xs text-gray-500">Q3</div>
                      
                      {/* Legend */}
                      <div className="absolute top-0 right-0 flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                        <span className="text-xs text-gray-500">Actual</span>
                        <div className="w-3 h-3 bg-indigo-500 rounded-sm ml-3 mr-1"></div>
                        <span className="text-xs text-gray-500">Projected</span>
                      </div>
                      
                      {/* Revenue indicator */}
                      <motion.div 
                        className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium text-blue-700 border border-blue-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 0.5 }}
                      >
                        $4.2M Projected
                      </motion.div>
                    </div>
                    
                    {/* Additional Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 rounded-md p-2 text-center">
                        <div className="text-xs text-gray-600">ARR Growth</div>
                        <div className="text-sm font-semibold text-green-600">+28.5%</div>
                      </div>
                      <div className="bg-blue-50 rounded-md p-2 text-center">
                        <div className="text-xs text-gray-600">MRR</div>
                        <div className="text-sm font-semibold text-blue-600">$352K</div>
                      </div>
                      <div className="bg-purple-50 rounded-md p-2 text-center">
                        <div className="text-xs text-gray-600">Retention</div>
                        <div className="text-sm font-semibold text-purple-600">94.3%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* MOCA Info */}
              <div className="order-1 lg:order-2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <motion.svg 
                      className="w-6 h-6" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      animate={{ 
                        y: [0, -5, 0],
                        rotateZ: [0, 5, 0, -5, 0]
                      }}
                      transition={{ 
                        duration: 5, 
                        ease: "easeInOut", 
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <path d="M3 10H21M7 15H8M12 15H13M6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </div>
                  <div>
                    <div className="text-xs text-blue-600 font-semibold tracking-wide uppercase">Modeling & Forecasting</div>
                    <h3 className="text-2xl font-bold text-gray-900">MOCA</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Our Modeling & Operational Cash Analysis (MOCA) system provides real-time revenue forecasting and scenario planning to optimize your revenue recognition strategy and cash flow management.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Multi-Scenario Planning</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Variable Recognition</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Cash Flow Analysis</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Forecast Comparison</p>
                  </div>
                </div>
                
                <motion.button 
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-fit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Explore MOCA</span>
                  <svg className="ml-2 -mr-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* DEAL DESK */}
          <motion.div 
            className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: 0.7,
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.2
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* DEAL DESK Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                    <motion.svg 
                      className="w-6 h-6" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      animate={{ 
                        rotateY: [0, 180],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotateY: {
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 5
                        },
                        scale: {
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }
                      }}
                    >
                      <path d="M10.75 13.25H6.75L13.25 6.75V10.75M2.25 7.75L7.75 2.25L14.25 8.75L21.75 16.25V21.75H16.25L8.75 14.25L2.25 7.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 font-semibold tracking-wide uppercase">Revenue Pipeline</div>
                    <h3 className="text-2xl font-bold text-gray-900">DEAL DESK</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Our Deal Desk provides a unified platform for tracking deal progression from negotiation to revenue recognition, with built-in compliance checks, approval workflows, and revenue impact analysis.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-purple-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Pipeline Visibility</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-purple-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Approval Workflows</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-purple-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Risk Assessment</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-purple-500">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Revenue Impact</p>
                  </div>
                </div>
                
                <motion.button 
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 w-fit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Explore DEAL DESK</span>
                  <svg className="ml-2 -mr-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
              
              {/* DEAL DESK Interactive Demo */}
              <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 p-6 lg:p-8">
                <div className="absolute top-0 right-0 h-px w-1/2 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                <div className="absolute bottom-0 left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-sm font-medium text-gray-500">DEAL DESK</div>
                    <div className="w-6"></div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm font-medium text-gray-700">Deal Pipeline View</div>
                      
                      {/* Filter buttons */}
                      <div className="flex items-center space-x-2 text-xs">
                        <motion.div 
                          className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 cursor-pointer"
                          whileHover={{ backgroundColor: "#f3e8ff", y: -1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Region
                        </motion.div>
                        <motion.div 
                          className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer"
                          whileHover={{ backgroundColor: "#e0e7ff", y: -1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ARR
                        </motion.div>
                        <motion.div 
                          className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer"
                          whileHover={{ backgroundColor: "#dbeafe", y: -1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Risk Score
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Deal Stages */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 h-[180px] overflow-y-auto">
                        <div className="font-medium text-xs text-gray-500 mb-2 flex items-center justify-between">
                          <span>NEGOTIATION</span>
                          <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs">4</span>
                        </div>
                        
                        <motion.div 
                          className="bg-white rounded-md p-2 border border-gray-200 mb-2 cursor-pointer"
                          whileHover={{ 
                            y: -2,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            borderColor: "#d1d5db"
                          }}
                        >
                          <div className="text-xs font-medium text-gray-700">Acme Corp</div>
                          <div className="text-xs text-gray-500 mt-1">$120K ARR</div>
                          <div className="flex items-center mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1"></div>
                            <span className="text-xs text-yellow-700">Medium Risk</span>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-white rounded-md p-2 border border-gray-200 mb-2 cursor-pointer"
                          whileHover={{ 
                            y: -2,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            borderColor: "#d1d5db"
                          }}
                        >
                          <div className="text-xs font-medium text-gray-700">Globex Inc</div>
                          <div className="text-xs text-gray-500 mt-1">$85K ARR</div>
                          <div className="flex items-center mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></div>
                            <span className="text-xs text-green-700">Low Risk</span>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-white rounded-md p-2 border border-gray-200 mb-2 cursor-pointer"
                          whileHover={{ 
                            y: -2,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            borderColor: "#d1d5db"
                          }}
                        >
                          <div className="text-xs font-medium text-gray-700">TechNova</div>
                          <div className="text-xs text-gray-500 mt-1">$240K ARR</div>
                          <div className="flex items-center mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></div>
                            <span className="text-xs text-red-700">High Risk</span>
                          </div>
                        </motion.div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-3 h-[180px] overflow-y-auto">
                        <div className="font-medium text-xs text-purple-800 mb-2 flex items-center justify-between">
                          <span>APPROVAL PENDING</span>
                          <span className="bg-purple-200 text-purple-700 rounded-full px-2 py-0.5 text-xs">3</span>
                        </div>
                        
                        <motion.div 
                          className="bg-white rounded-md p-2 border border-purple-200 mb-2 cursor-pointer"
                          whileHover={{ 
                            y: -2,
                            boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.1)",
                            borderColor: "#ddd6fe"
                          }}
                        >
                          <div className="text-xs font-medium text-gray-700">Initech LLC</div>
                          <div className="text-xs text-gray-500 mt-1">$195K ARR</div>
                          <div className="flex items-center mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1"></div>
                            <span className="text-xs text-yellow-700">Finance Review</span>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-white rounded-md p-2 border border-purple-200 mb-2 cursor-pointer"
                          whileHover={{ 
                            y: -2,
                            boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.1)",
                            borderColor: "#ddd6fe"
                          }}
                        >
                          <div className="text-xs font-medium text-gray-700">SkyHigh Cloud</div>
                          <div className="text-xs text-gray-500 mt-1">$320K ARR</div>
                          <div className="flex items-center mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></div>
                            <span className="text-xs text-blue-700">Legal Review</span>
                          </div>
                        </motion.div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-3 h-[180px] overflow-y-auto">
                        <div className="font-medium text-xs text-green-800 mb-2 flex items-center justify-between">
                          <span>CLOSED WON</span>
                          <span className="bg-green-200 text-green-700 rounded-full px-2 py-0.5 text-xs">2</span>
                        </div>
                        
                        <motion.div 
                          className="bg-white rounded-md p-2 border border-green-200 mb-2 cursor-pointer"
                          whileHover={{ 
                            y: -2,
                            boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.1)",
                            borderColor: "#a7f3d0"
                          }}
                        >
                          <div className="text-xs font-medium text-gray-700">MegaSoft Inc</div>
                          <div className="text-xs text-gray-500 mt-1">$260K ARR</div>
                          <div className="text-xs text-green-700 mt-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Revenue Recognized
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-white rounded-md p-2 border border-green-200 mb-2 cursor-pointer"
                          whileHover={{ 
                            y: -2,
                            boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.1)",
                            borderColor: "#a7f3d0"
                          }}
                        >
                          <div className="text-xs font-medium text-gray-700">Stellar Systems</div>
                          <div className="text-xs text-gray-500 mt-1">$180K ARR</div>
                          <div className="text-xs text-purple-700 mt-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Pending Recognition
                          </div>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Summary Stats */}
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Pipeline Value</div>
                          <div className="text-sm font-semibold text-purple-700">$1.2M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Avg. Deal Size</div>
                          <div className="text-sm font-semibold text-indigo-700">$215K</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Close Rate</div>
                          <div className="text-sm font-semibold text-green-700">62%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-20 pt-10 border-t border-white/10 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ 
              duration: 0.7,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <motion.div 
              className="inline-flex items-center justify-center rounded-full px-4 py-1 bg-white/5 text-blue-200 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              whileHover={{ 
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transition: { duration: 0.2 }
              }}
            >
              <motion.svg 
                className="w-4 h-4 mr-2" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                animate={{ 
                  x: [0, 3, 0],
                  transition: { 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    duration: 1.5,
                    ease: "easeInOut"
                  }
                }}
              >
                <path d="M9.31 17.25L14.53 12.03L9.31 6.81001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
              <span className="text-sm font-semibold">Continuous Improvement</span>
            </motion.div>
            
            <motion.div
              className="bg-gradient-to-br from-primary/95 to-primary-900/90 rounded-xl shadow-xl mb-6 overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {/* Section Header */}
              <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-md bg-blue-500/30 flex items-center justify-center mr-3 border border-blue-400/30">
                    <svg className="w-4 h-4 text-blue-100" viewBox="0 0 24 24" fill="none">
                      <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Advanced Financial Intelligence</h3>
                </div>
                <div className="bg-white/10 backdrop-blur-md text-xs font-medium text-blue-100 px-3 py-1 rounded-full border border-white/10">
                  Precision-driven
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <motion.div
                    className="rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L12 12L16 10M16 10L20 10.0001V20L16 20M16 10V20M16 20L12 18L8 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 12L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h4 className="text-base font-semibold text-white">Recognition Model Accuracy</h4>
                      </div>
                      <div className="bg-emerald-500/20 text-emerald-300 text-xs font-bold py-1 px-2 rounded flex items-center">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        +3.2%
                      </div>
                    </div>
                    
                    <div className="relative h-20">
                      {/* Bar Chart */}
                      <div className="absolute inset-0 flex items-end">
                        <div className="flex-1 mx-0.5 h-[65%] bg-gradient-to-t from-blue-400/40 to-blue-400/80 rounded-sm"></div>
                        <div className="flex-1 mx-0.5 h-[75%] bg-gradient-to-t from-blue-400/40 to-blue-400/80 rounded-sm"></div>
                        <div className="flex-1 mx-0.5 h-[85%] bg-gradient-to-t from-blue-400/40 to-blue-400/80 rounded-sm"></div>
                        <div className="flex-1 mx-0.5 h-[80%] bg-gradient-to-t from-blue-400/40 to-blue-400/80 rounded-sm"></div>
                        <div className="flex-1 mx-0.5 h-[90%] bg-gradient-to-t from-blue-400/40 to-blue-500/80 rounded-sm"></div>
                        <div className="flex-1 mx-0.5 h-full bg-gradient-to-t from-blue-400/60 to-blue-500 rounded-sm"></div>
                      </div>
                      
                      {/* Overlay Line */}
                      <div className="absolute inset-0 flex items-end pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M0,40 L16.66,30 L33.33,15 L50,20 L66.66,25 L83.33,10 L100,0" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-6 mt-1">
                      <div className="text-[10px] text-blue-200/70 text-center">Q1</div>
                      <div className="text-[10px] text-blue-200/70 text-center">Q2</div>
                      <div className="text-[10px] text-blue-200/70 text-center">Q3</div>
                      <div className="text-[10px] text-blue-200/70 text-center">Q4</div>
                      <div className="text-[10px] text-blue-200/70 text-center">Q1</div>
                      <div className="text-[10px] text-blue-200/70 text-center">Q2</div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xl font-bold text-white">97.8%</div>
                      <div className="text-xs text-blue-200/70">Model confidence</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M21 7.35304L12 2L3 7.35304L12 12.7061L21 7.35304Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 16.6479L12 22.0009L21 16.6479" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 12L12 17.353L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h4 className="text-base font-semibold text-white">Processing Volume</h4>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 mb-2">
                      <div className="bg-indigo-400/20 text-xs text-indigo-300 rounded-full px-2 py-0.5">Contracts</div>
                      <div className="bg-teal-400/20 text-xs text-teal-300 rounded-full px-2 py-0.5">Amendments</div>
                      <div className="bg-purple-400/20 text-xs text-purple-300 rounded-full px-2 py-0.5">SOWs</div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="text-3xl font-bold text-white">1,428</div>
                      <div className="text-sm text-blue-200/70">documents processed monthly</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="px-2 py-1.5 bg-white/10 rounded border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-xs text-blue-200/70 mb-1">Process Time</div>
                        <div className="text-lg font-semibold text-white flex items-center">
                          <svg className="w-3 h-3 mr-1 text-green-400" fill="none" viewBox="0 0 24 24">
                            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          3.2<span className="text-xs ml-0.5">min</span>
                        </div>
                      </div>
                      
                      <div className="px-2 py-1.5 bg-white/10 rounded border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-xs text-blue-200/70 mb-1">Accuracy</div>
                        <div className="text-lg font-semibold text-white">99.4%</div>
                      </div>
                      
                      <div className="px-2 py-1.5 bg-white/10 rounded border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-xs text-blue-200/70 mb-1">Cost Savings</div>
                        <div className="text-lg font-semibold text-white">68%</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div 
                    className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 p-4 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)", y: -4 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 shadow-md">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                          <path d="M9 19L14 14L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 19L19 14L14 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 19L5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="bg-blue-400/20 text-xs text-blue-200 font-medium px-2 py-0.5 rounded-full">
                        42 models
                      </div>
                    </div>
                    
                    <h4 className="text-base font-semibold text-white mb-1">Adaptive Learning</h4>
                    <p className="text-xs text-blue-100/90 mb-3">Refines recognition models based on contract patterns and outcomes</p>
                    
                    <div className="bg-white/5 rounded p-2 border border-white/5 text-xs">
                      <div className="flex justify-between text-blue-100 mb-1">
                        <span>Learning Rate</span>
                        <span className="text-emerald-300">0.025</span>
                      </div>
                      <div className="w-full bg-blue-900/30 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-blue-400 to-emerald-400 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 p-4 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)", y: -4 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3 shadow-md">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 12L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="bg-indigo-400/20 text-xs text-indigo-200 font-medium px-2 py-0.5 rounded-full">
                        Last: 2 days ago
                      </div>
                    </div>
                    
                    <h4 className="text-base font-semibold text-white mb-1">Real-time Updates</h4>
                    <p className="text-xs text-blue-100/90 mb-3">Incorporates regulatory changes and accounting standard updates</p>
                    
                    <div className="space-y-1.5">
                      <div className="bg-white/5 border border-white/5 rounded px-2 py-1.5 text-xs flex justify-between items-center">
                        <span className="text-blue-100">ASC 606 Amendment</span>
                        <span className="text-green-300">Applied</span>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded px-2 py-1.5 text-xs flex justify-between items-center">
                        <span className="text-blue-100">IFRS 15 Update 24.2</span>
                        <span className="text-green-300">Applied</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 p-4 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)", y: -4 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-3 shadow-md">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                          <path d="M20.25 6.375C20.25 8.65317 16.5563 10.5 12 10.5C7.44365 10.5 3.75 8.65317 3.75 6.375M20.25 6.375C20.25 4.09683 16.5563 2.25 12 2.25C7.44365 2.25 3.75 4.09683 3.75 6.375M20.25 6.375V17.625C20.25 19.9032 16.5563 21.75 12 21.75C7.44365 21.75 3.75 19.9032 3.75 17.625V6.375M20.25 6.375V10.125M3.75 6.375V10.125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="bg-teal-400/20 text-xs text-teal-200 font-medium px-2 py-0.5 rounded-full">
                        100% Compliant
                      </div>
                    </div>
                    
                    <h4 className="text-base font-semibold text-white mb-1">Audit-Ready</h4>
                    <p className="text-xs text-blue-100/90 mb-3">Ensures full IFRS 15/ASC 606 compliance with documentation</p>
                    
                    <div className="w-full bg-white/5 rounded p-2 border border-white/5">
                      <div className="flex justify-between text-xs text-blue-100">
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1 text-green-400" fill="none" viewBox="0 0 24 24">
                            <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Documentation</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1 text-green-400" fill="none" viewBox="0 0 24 24">
                            <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Validation</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-800">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'white\' fill-opacity=\'0.15\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")',
               }}>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-40 bg-gradient-to-l from-secondary/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 opacity-30 bg-gradient-to-t from-accent/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <motion.div 
            className="lg:grid lg:grid-cols-2 lg:gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: 0.2, 
                duration: 0.7,
                type: "spring",
                stiffness: 50,
                damping: 10
              }}
            >
              <motion.h2 
                className="text-4xl font-bold tracking-tight text-white md:text-5xl"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.span 
                  className="block mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  Ready to streamline your
                </motion.span>
                <motion.span 
                  className="block text-gradient bg-gradient-to-r from-white via-accent-200 to-white bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  revenue operations?
                </motion.span>
              </motion.h2>
              <motion.p 
                className="mt-4 text-lg text-white/70 max-w-md"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Join forward-thinking financial teams using PRA to automate compliance, 
                maximize revenue recognition, and gain unprecedented insights.
              </motion.p>
              
              <motion.div 
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Link href="/signup">
                  <AnimatedButton 
                    className="relative group overflow-hidden rounded-full bg-white px-6 py-3 text-primary shadow-lg hover:shadow-xl transition-all duration-300"
                    hoverEffect="lift"
                    icon={
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    }
                    iconPosition="right"
                  >
                    Request Demo
                  </AnimatedButton>
                </Link>
                
                <Link href="/knowledge-center">
                  <AnimatedButton 
                    className="relative group overflow-hidden rounded-full bg-transparent px-6 py-3 text-white border border-white/30 hover:bg-white/10 transition-all duration-300"
                    variant="outline"
                    hoverEffect="glow"
                  >
                    Learn more
                  </AnimatedButton>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="hidden lg:block relative mt-12 lg:mt-0"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: 0.4, 
                duration: 0.7, 
                type: "spring",
                stiffness: 50,
                damping: 10
              }}
            >
              <motion.div 
                className="relative z-10 bg-white rounded-xl shadow-2xl overflow-hidden"
                initial={{ rotate: 1 }}
                whileInView={{ 
                  rotate: 0,
                  transition: { 
                    delay: 0.7, 
                    duration: 1,
                    type: "spring",
                    stiffness: 50,
                    damping: 10
                  }
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15 
                  }
                }}
              >
                <div className="bg-white rounded-xl overflow-hidden">
                  {/* Dashboard Header with Tabs */}
                  <div className="bg-gray-100 border-b border-gray-200">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700 ml-3">PRA Executive Dashboard</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-xs text-gray-500 px-2 py-1 rounded-md bg-white border border-gray-200">
                          Last updated: Today 9:30 AM
                        </div>
                      </div>
                    </div>
                    <div className="flex px-4">
                      <div className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">Revenue Recognition</div>
                      <div className="px-4 py-2 text-gray-500 text-sm">Deal Desk</div>
                      <div className="px-4 py-2 text-gray-500 text-sm">Forecasting</div>
                      <div className="px-4 py-2 text-gray-500 text-sm">KPI Dashboard</div>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-4">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                        <div className="text-xs font-medium text-gray-500 mb-1">Recognized Revenue</div>
                        <div className="text-xl font-bold text-gray-800">$2.4M</div>
                        <div className="flex items-center mt-1">
                          <div className="text-xs font-medium text-emerald-600 flex items-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            8.2%
                          </div>
                          <div className="text-xs text-gray-500 ml-2">vs. last period</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                        <div className="text-xs font-medium text-gray-500 mb-1">Pending Approval</div>
                        <div className="text-xl font-bold text-gray-800">$842K</div>
                        <div className="flex items-center mt-1">
                          <div className="text-xs font-medium text-blue-600">
                            3 contracts awaiting review
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                        <div className="text-xs font-medium text-gray-500 mb-1">Recognition Accuracy</div>
                        <div className="text-xl font-bold text-gray-800">99.2%</div>
                        <div className="flex items-center mt-1">
                          <div className="text-xs font-medium text-emerald-600 flex items-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            1.4%
                          </div>
                          <div className="text-xs text-gray-500 ml-2">improvement</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Revenue Recognition Chart */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm font-semibold text-gray-800">Revenue Recognition Timeline</div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-xs">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                            <span className="text-gray-600">Recognized</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="w-3 h-3 bg-indigo-300 rounded-full mr-1"></div>
                            <span className="text-gray-600">Scheduled</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-32 w-full">
                        {/* Chart Visualization */}
                        <div className="relative h-full w-full">
                          {/* X Axis */}
                          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 flex justify-between px-2 pt-1">
                            <div className="text-xs text-gray-500">Jan</div>
                            <div className="text-xs text-gray-500">Feb</div>
                            <div className="text-xs text-gray-500">Mar</div>
                            <div className="text-xs text-gray-500">Apr</div>
                            <div className="text-xs text-gray-500">May</div>
                            <div className="text-xs text-gray-500">Jun</div>
                          </div>
                          
                          {/* Chart Bars */}
                          <div className="absolute bottom-6 left-0 right-0 h-[calc(100%-24px)] flex items-end">
                            <div className="w-1/6 h-full flex flex-col justify-end px-1">
                              <div className="bg-blue-500 w-full h-[70%] rounded-t"></div>
                            </div>
                            <div className="w-1/6 h-full flex flex-col justify-end px-1">
                              <div className="bg-blue-500 w-full h-[85%] rounded-t"></div>
                            </div>
                            <div className="w-1/6 h-full flex flex-col justify-end px-1">
                              <div className="bg-blue-500 w-full h-[60%] rounded-t"></div>
                            </div>
                            <div className="w-1/6 h-full flex flex-col justify-end px-1">
                              <div className="bg-blue-500 w-full h-[90%] rounded-t"></div>
                            </div>
                            <div className="w-1/6 h-full flex flex-col justify-end px-1">
                              <div className="bg-blue-500 w-full h-[75%] rounded-t-md"></div>
                              <div className="bg-indigo-300 w-full h-[15%] opacity-70"></div>
                            </div>
                            <div className="w-1/6 h-full flex flex-col justify-end px-1">
                              <div className="bg-indigo-300 w-full h-[60%] rounded-t opacity-70"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Deal Desk & AI Insights */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm font-semibold text-gray-800">Deal Desk Pipeline</div>
                          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                            3 new deals this week
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="p-2 rounded-md border border-gray-100 bg-gray-50 flex justify-between">
                            <div className="text-xs font-medium text-gray-700">Enterprise SaaS</div>
                            <div className="text-xs font-medium text-amber-600">$420K</div>
                          </div>
                          <div className="p-2 rounded-md border border-gray-100 bg-gray-50 flex justify-between">
                            <div className="text-xs font-medium text-gray-700">Cloud Services</div>
                            <div className="text-xs font-medium text-amber-600">$275K</div>
                          </div>
                          <div className="p-2 rounded-md border border-gray-100 bg-gray-50 flex justify-between">
                            <div className="text-xs font-medium text-gray-700">Data Processing</div>
                            <div className="text-xs font-medium text-amber-600">$195K</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm font-semibold text-gray-800">Revenue Forecast</div>
                          <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                            Updated Today
                          </div>
                        </div>
                        <div className="h-24 w-full relative">
                          {/* Line Chart */}
                          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full">
                            <path d="M0,35 L10,32 L20,34 L30,25 L40,28 L50,20 L60,15 L70,18 L80,10 L90,13 L100,5" 
                                  stroke="#3b82f6" 
                                  strokeWidth="2" 
                                  fill="none" 
                                  className="drop-shadow-md" />
                            <path d="M0,35 L10,32 L20,34 L30,25 L40,28 L50,20 L60,15 L70,18 L80,10 L90,13 L100,5 L100,40 L0,40 Z" 
                                  fill="url(#gradient)" 
                                  opacity="0.2" />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full filter blur-3xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-400/10 rounded-full filter blur-3xl"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
