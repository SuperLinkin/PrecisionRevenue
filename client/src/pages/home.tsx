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
                      
                      {/* Top stats row */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-primary-800/40 border border-white/5 p-3">
                          <div className="text-xs text-white/60 mb-1">REMY Accuracy</div>
                          <div className="text-xl font-bold text-white">98.7%</div>
                          <div className="text-xs text-emerald-400 flex items-center mt-1">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            +1.2%
                          </div>
                        </div>
                        <div className="rounded-lg bg-gradient-to-br from-indigo-500/20 to-primary-800/40 border border-white/5 p-3">
                          <div className="text-xs text-white/60 mb-1">Contracts Analyzed</div>
                          <div className="text-xl font-bold text-white">248</div>
                          <div className="text-xs text-emerald-400 flex items-center mt-1">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            +24
                          </div>
                        </div>
                        <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-primary-800/40 border border-white/5 p-3">
                          <div className="text-xs text-white/60 mb-1">Time Saved</div>
                          <div className="text-xl font-bold text-white">342h</div>
                          <div className="text-xs text-emerald-400 flex items-center mt-1">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            +18h
                          </div>
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
      <div className="relative bg-gradient-to-b from-white to-white/90 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-accent opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 w-72 h-72 rounded-full bg-primary opacity-20 blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.1) 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }}></div>
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
      
      {/* AI Capabilities Section */}
      <div className="relative bg-gradient-to-b from-background/80 via-background/90 to-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white opacity-20"></div>
          <div className="absolute inset-0 opacity-5" 
               style={{ 
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%233B82F6\' fill-opacity=\'0.15\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
               }}>
          </div>
          <div className="absolute -top-40 right-20 w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20 blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:py-36 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-blue-300 ring-1 ring-inset ring-blue-300/20 mb-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <svg className="mr-1 h-1.5 w-1.5 fill-blue-300 animate-pulse" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
              Precision Technology
            </motion.span>
            <motion.h2 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent pb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Powered by Advanced Financial Intelligence
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-neutral font-light max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Our proprietary systems combine sophisticated algorithms with financial expertise to deliver unprecedented automation and insights for revenue operations.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {aiCapabilities.map((capability, index) => (
              <motion.div 
                key={index}
                className="relative group overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      duration: 0.5
                    }
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 rounded-2xl"></div>
                <motion.div 
                  className="relative z-10 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl"
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    transition: { type: "spring", stiffness: 300, damping: 15 }
                  }}
                >
                  <motion.div 
                    className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/10 text-4xl mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 * index, duration: 0.4 }}
                  >
                    {capability.icon}
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-bold text-primary mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (0.2 * index), duration: 0.3 }}
                  >
                    {capability.title}
                  </motion.h3>
                  <motion.p 
                    className="text-neutral mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + (0.2 * index), duration: 0.3 }}
                  >
                    {capability.description}
                  </motion.p>
                  
                  <motion.div 
                    className="grid grid-cols-3 gap-2 mt-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (0.2 * index), duration: 0.3 }}
                  >
                    <motion.div 
                      className="bg-white/10 rounded-lg p-4 text-center"
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <div className="text-lg font-bold text-accent">{capability.stats.accuracy}</div>
                      <div className="text-xs text-neutral/80">Accuracy</div>
                    </motion.div>
                    <motion.div 
                      className="bg-white/10 rounded-lg p-4 text-center"
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <div className="text-lg font-bold text-secondary">{capability.stats.speedImprovement}</div>
                      <div className="text-xs text-neutral/80">Faster</div>
                    </motion.div>
                    <motion.div 
                      className="bg-white/10 rounded-lg p-4 text-center"
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <div className="text-lg font-bold text-primary">{capability.stats.dataPoints}</div>
                      <div className="text-xs text-neutral/80">Data Points</div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
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
            
            <motion.h3 
              className="text-3xl font-semibold text-white mb-3 bg-primary/40 inline-block px-6 py-2 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ 
                backgroundColor: "rgba(15, 23, 42, 0.5)",
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              Advanced Financial Intelligence
            </motion.h3>
            
            <motion.p 
              className="max-w-2xl mx-auto text-white mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              PRA's financial systems continuously adapt to new data, regulatory changes, and user feedback to enhance recognition accuracy and forecasting precision.
            </motion.p>
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
