import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { FeatureCard } from '@/components/ui/feature-card';
import { TestimonialCard } from '@/components/ui/testimonial-card';
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
                      {/* Top stats row */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-primary-800/40 border border-white/5 p-3">
                          <div className="text-xs text-white/60 mb-1">AI Accuracy</div>
                          <div className="text-xl font-bold text-white">98.7%</div>
                          <div className="text-xs text-emerald-400 flex items-center mt-1">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            +1.2%
                          </div>
                        </div>
                        <div className="rounded-lg bg-gradient-to-br from-indigo-500/20 to-primary-800/40 border border-white/5 p-3">
                          <div className="text-xs text-white/60 mb-1">Revenue</div>
                          <div className="text-xl font-bold text-white">$3.4M</div>
                          <div className="text-xs text-emerald-400 flex items-center mt-1">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            +8.2%
                          </div>
                        </div>
                        <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-primary-800/40 border border-white/5 p-3">
                          <div className="text-xs text-white/60 mb-1">Contracts</div>
                          <div className="text-xl font-bold text-white">248</div>
                          <div className="text-xs text-emerald-400 flex items-center mt-1">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            +24
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Revenue chart */}
                      <div className="rounded-lg bg-gradient-to-b from-primary-800/40 to-primary-900/40 border border-white/5 p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm font-medium text-white flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                            Advanced Revenue Prediction
                          </div>
                          <div className="flex space-x-2 text-xs">
                            <div className="px-2 py-1 rounded bg-blue-500/20 text-blue-300">Q1</div>
                            <div className="px-2 py-1 rounded bg-blue-500/20 text-blue-300">Q2</div>
                            <div className="px-2 py-1 rounded bg-white/20 text-white">Q3</div>
                            <div className="px-2 py-1 rounded bg-blue-500/20 text-blue-300">Q4</div>
                          </div>
                        </div>
                        
                        <div className="relative h-32">
                          {/* Chart line */}
                          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path 
                              d="M0,50 C20,30 40,70 60,40 C80,10 100,50 100,50" 
                              stroke="url(#gradient)" 
                              strokeWidth="2" 
                              fill="url(#areaGradient)"
                              vectorEffect="non-scaling-stroke"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#8B5CF6" />
                              </linearGradient>
                              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </svg>
                          
                          {/* Data points with glowing effect */}
                          <div className="absolute left-[20%] top-[30%] h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]"></div>
                          <div className="absolute left-[40%] top-[70%] h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]"></div>
                          <div className="absolute left-[60%] top-[40%] h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_10px_2px_rgba(99,102,241,0.5)]"></div>
                          <div className="absolute left-[80%] top-[10%] h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_10px_2px_rgba(139,92,246,0.5)]"></div>
                          <div className="absolute left-[100%] top-[50%] h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]"></div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div className="rounded bg-white/5 p-2 text-center">
                            <div className="text-xs text-white/60">Actual</div>
                            <div className="text-sm font-medium text-white">$1.8M</div>
                          </div>
                          <div className="rounded bg-white/5 p-2 text-center">
                            <div className="text-xs text-white/60">Predicted</div>
                            <div className="text-sm font-medium text-blue-400">$1.9M</div>
                          </div>
                          <div className="rounded bg-white/5 p-2 text-center">
                            <div className="text-xs text-white/60">Variance</div>
                            <div className="text-sm font-medium text-emerald-400">+5.5%</div>
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
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary ring-1 ring-inset ring-secondary/30 mb-3">
              <svg className="mr-1 h-1.5 w-1.5 fill-secondary animate-pulse" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
              AI-Powered Platform
            </span>
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2">
              Our Comprehensive Solution Suite
            </h2>
            <p className="mt-4 text-lg text-neutral font-light max-w-2xl mx-auto">
              PRA's integrated tools work together to streamline your financial operations with advanced AI and automation technologies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                features={feature.features}
                icon={feature.icon}
              />
            ))}
          </div>
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
          <div className="max-w-3xl mx-auto text-center mb-20">
            <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary ring-1 ring-inset ring-secondary/20 mb-3">
              <svg className="mr-1 h-1.5 w-1.5 fill-secondary animate-pulse" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
              Advanced AI Technology
            </span>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent pb-2">
              Powered by Cutting-Edge Intelligence
            </h2>
            <p className="mt-4 text-lg text-neutral font-light max-w-2xl mx-auto">
              Our proprietary AI models blend deep learning, machine learning, and financial expertise to deliver unprecedented automation and insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {aiCapabilities.map((capability, index) => (
              <div 
                key={index}
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 rounded-2xl"></div>
                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 text-4xl mb-6">
                    {capability.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary mb-3">{capability.title}</h3>
                  <p className="text-neutral mb-6">{capability.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-lg font-bold text-accent">{capability.stats.accuracy}</div>
                      <div className="text-xs text-neutral/80">Accuracy</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-lg font-bold text-secondary">{capability.stats.speedImprovement}</div>
                      <div className="text-xs text-neutral/80">Faster</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-lg font-bold text-primary">{capability.stats.dataPoints}</div>
                      <div className="text-xs text-neutral/80">Data Points</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 pt-10 border-t border-white/10 text-center">
            <div className="inline-flex items-center justify-center rounded-full px-4 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 mb-4">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.31 17.25L14.53 12.03L9.31 6.81001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm font-semibold">Continuous Learning</span>
            </div>
            <h3 className="text-3xl font-semibold text-white mb-3">Our AI Gets Smarter Every Day</h3>
            <p className="max-w-2xl mx-auto text-neutral/80">
              PRA's intelligent systems continuously learn from new financial data, regulatory changes, and user interactions to improve recognition accuracy and forecasting precision.
            </p>
          </div>
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
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                <span className="block mb-2">Ready to streamline your</span>
                <span className="block text-gradient bg-gradient-to-r from-white via-accent-200 to-white bg-clip-text text-transparent">
                  revenue operations?
                </span>
              </h2>
              <p className="mt-4 text-lg text-white/70 max-w-md">
                Join forward-thinking financial teams using PRA to automate compliance, 
                maximize revenue recognition, and gain unprecedented insights.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button className="relative group overflow-hidden rounded-full bg-white px-6 py-3 text-primary shadow-lg hover:shadow-xl transition-all duration-300">
                    <span className="relative z-10 font-semibold flex items-center">
                      Request Demo
                      <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <span className="absolute bottom-0 left-0 right-0 h-0 bg-accent/20 transition-all duration-300 group-hover:h-full z-0"></span>
                  </Button>
                </Link>
                
                <Link href="/knowledge-center">
                  <Button className="relative group overflow-hidden rounded-full bg-transparent px-6 py-3 text-white border border-white/30 hover:bg-white/10 transition-all duration-300">
                    <span className="relative z-10 font-semibold flex items-center">
                      Learn more
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block relative mt-12 lg:mt-0">
              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="bg-gradient-to-br from-background/90 to-background border border-white/5 rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="text-xs text-white/70">PRA Analytics</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="h-3 w-3/4 bg-white/10 rounded-full"></div>
                      <div className="h-3 w-full bg-white/10 rounded-full"></div>
                      <div className="h-3 w-2/3 bg-white/10 rounded-full"></div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="h-2 w-1/2 bg-white/10 rounded-full mb-2"></div>
                        <div className="h-10 bg-accent/10 rounded"></div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="h-2 w-1/2 bg-white/10 rounded-full mb-2"></div>
                        <div className="h-10 bg-secondary/10 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between mb-2">
                        <div className="h-2 w-1/4 bg-white/10 rounded-full"></div>
                        <div className="h-2 w-1/5 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="h-20 bg-gradient-to-r from-secondary/20 via-accent/20 to-primary/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full filter blur-3xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full filter blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
