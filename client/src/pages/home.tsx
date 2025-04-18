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
      description: 'Contract Lifecycle Analysis Utility System for extracting key terms.',
      icon: <FileTextIcon className="h-6 w-6 text-secondary" />,
      features: [
        'AI-powered contract analysis',
        'Performance obligation extraction',
        'Risk assessment'
      ]
    },
    {
      title: 'MOCA',
      description: 'Management and Operations Compliance Advisor for internal controls.',
      icon: <ClipboardCheckIcon className="h-6 w-6 text-secondary" />,
      features: [
        'Approval workflows',
        'Audit trail documentation',
        'Compliance reporting'
      ]
    },
    {
      title: 'NOVA',
      description: 'Next-gen Operational Visualization Analytics for financial insights.',
      icon: <LineChartIcon className="h-6 w-6 text-secondary" />,
      features: [
        'Revenue forecasting',
        'Customizable dashboards',
        'Variance analysis'
      ]
    }
  ];

  const testimonials = [
    {
      rating: 5,
      quote: 'PRA has transformed how we manage revenue recognition. The automation has saved our finance team countless hours each quarter.',
      author: {
        name: 'James Wilson',
        title: 'CFO, TechVision Inc.'
      }
    },
    {
      rating: 5,
      quote: 'The contract analysis tool is brilliant. We\'ve reduced our review time by 85% and improved accuracy in identifying performance obligations.',
      author: {
        name: 'Sarah Johnson',
        title: 'Controller, Global Services Ltd.'
      }
    },
    {
      rating: 5,
      quote: 'Our auditors love the transparency and documentation that PRA provides. It\'s made our compliance with ASC 606 much more manageable.',
      author: {
        name: 'Michael Thompson',
        title: 'VP Finance, InnoSystems'
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Precision Revenue Automation
              </h1>
              <p className="mt-6 text-xl max-w-3xl">
                Automate your revenue recognition, contract analysis, and financial reporting with PRA's comprehensive SaaS platform.
              </p>
              <div className="mt-10 flex gap-3">
                <Link href="/signup">
                  <Button className="bg-secondary hover:bg-blue-600 text-white px-8 py-3">
                    Get Started
                  </Button>
                </Link>
                <Link href="/knowledge-center">
                  <Button variant="outline" className="bg-primary border border-white hover:bg-primary-700 text-white px-8 py-3">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="bg-gradient-to-br from-white/20 to-white/5 rounded-xl p-6 backdrop-blur-lg border border-white/10 shadow-xl">
                <div className="rounded-lg shadow-2xl bg-white overflow-hidden">
                  <div className="bg-primary px-4 py-3 flex items-center justify-between">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-white font-medium">Precision Revenue Dashboard</div>
                    <div></div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="col-span-3 bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm font-bold text-primary">Revenue Overview</div>
                          <div className="text-xs text-secondary font-medium">YTD 2025</div>
                        </div>
                        <div className="h-[100px] relative">
                          {/* Chart visual representation */}
                          <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                            <div className="w-1/12 h-[40%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[55%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[45%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[65%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[75%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[60%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[85%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[80%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[90%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[70%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[75%] bg-secondary mx-[2px] rounded-t"></div>
                            <div className="w-1/12 h-[80%] bg-secondary mx-[2px] rounded-t"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-accent/5 p-3 rounded-lg border border-accent/10">
                        <div className="text-sm font-bold text-primary mb-1">Active Contracts</div>
                        <div className="text-2xl font-bold text-accent">248</div>
                        <div className="text-xs text-accent mt-1">+12 this month</div>
                      </div>
                      
                      <div className="bg-secondary/5 p-3 rounded-lg border border-secondary/10">
                        <div className="text-sm font-bold text-primary mb-1">Revenue</div>
                        <div className="text-2xl font-bold text-secondary">$3.4M</div>
                        <div className="text-xs text-secondary mt-1">+8.2% QoQ</div>
                      </div>
                      
                      <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <div className="text-sm font-bold text-primary mb-1">Compliance</div>
                        <div className="text-2xl font-bold text-primary">98%</div>
                        <div className="text-xs text-primary mt-1">IFRS/ASC 606</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 text-xs">
                      <div className="bg-secondary text-white px-2 py-1 rounded-sm">Dashboard</div>
                      <div className="text-neutral px-2 py-1">Reports</div>
                      <div className="text-neutral px-2 py-1">Analytics</div>
                      <div className="text-neutral px-2 py-1">Settings</div>
                    </div>
                  </div>
                </div>
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
      
      {/* Testimonials Section */}
      <div className="relative bg-gradient-to-b from-background/80 to-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white opacity-50"></div>
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle at 25px 25px, #3B82F6 2px, transparent 0)', 
                 backgroundSize: '50px 50px' 
               }}>
          </div>
          <div className="absolute -top-40 right-20 w-80 h-80 rounded-full bg-gradient-to-br from-secondary/30 to-accent/30 blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:py-32 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 mb-3">
              <svg className="mr-1 h-1.5 w-1.5 fill-primary animate-pulse" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
              Customer Success Stories
            </span>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent pb-1">
              Trusted by Financial Leaders
            </h2>
            <p className="mt-4 text-lg text-neutral font-light max-w-2xl mx-auto">
              See how PRA is transforming financial operations across diverse industries with innovative solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex justify-center">
                <TestimonialCard
                  rating={testimonial.rating}
                  quote={testimonial.quote}
                  author={testimonial.author}
                />
              </div>
            ))}
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
