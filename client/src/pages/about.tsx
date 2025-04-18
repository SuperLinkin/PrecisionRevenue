import { NavBar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Header */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">About PRA</h1>
            <p className="mt-4 text-xl max-w-3xl mx-auto">
              Leading the way in revenue automation and financial compliance
            </p>
          </div>
        </div>
      </div>
      
      {/* Executive Summary */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/95 to-primary-900/90 rounded-xl shadow-xl overflow-hidden">
            {/* Section Header */}
            <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-blue-500/30 flex items-center justify-center mr-3 border border-blue-400/30">
                  <svg className="w-4 h-4 text-blue-100" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7L15 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 3V7H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Executive Summary</h3>
              </div>
              <div className="bg-white/10 text-xs font-medium text-blue-100 px-3 py-1 rounded-full border border-white/10">
                April 2025
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 text-white">
              <div className="text-blue-50 leading-relaxed text-sm md:text-base space-y-4">
                <p>
                  Our revenue lifecycle automation platform is designed specifically for the modern B2B SaaS ecosystem. Targeting the urgent needs of mid-market and enterprise SaaS firms, especially those in North America, Europe, and India, our platform brings end-to-end automation to the revenue lifecycle—from quote to cash, contract intelligence, and compliance.
                </p>
                <p>
                  Built using an AI-native, modular architecture, we integrate Lovable AI for rapid UI deployment, Supabase for secure and scalable multi-tenant data handling, OpenAI GPT-4 for document and revenue intelligence, Dify for multi-agent workflows, and MCP for persistent AI context. Our system delivers real-time insights, automates high-complexity processes like clause extraction and revenue forecasting, and ensures compliance with ASC 606 and IFRS 15.
                </p>
                <p>
                  The global SaaS market is booming, with over 60,000 SaaS firms expected to contribute to a $37.1B addressable market in revenue automation by 2030. We target a Serviceable Available Market of ~$7.8B, validated by data from SaaSBoomi, Tracxn, and Crunchbase. Our platform is uniquely positioned against competitors by combining AI, flexibility, and affordability for the underserved mid-market.
                </p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center mb-3">
                    <svg className="h-5 w-5 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <h4 className="font-semibold text-white">Market Opportunity</h4>
                  </div>
                  <p className="text-blue-100 text-sm">$37.1B addressable market in revenue automation by 2030</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center mb-3">
                    <svg className="h-5 w-5 text-green-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h4 className="font-semibold text-white">Target Segment</h4>
                  </div>
                  <p className="text-blue-100 text-sm">Mid-market and enterprise SaaS firms in North America, Europe, and India</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center mb-3">
                    <svg className="h-5 w-5 text-purple-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h4 className="font-semibold text-white">Competitive Advantage</h4>
                  </div>
                  <p className="text-blue-100 text-sm">AI-powered, flexible, and affordable solution for the underserved mid-market</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leadership Team - Co-founders */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-primary">Our Leadership</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the team that's revolutionizing revenue automation
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pranav - CEO */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary font-bold text-xl">
                    PM
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">Pranav MV</h3>
                    <p className="text-blue-600 font-medium">CEO & Co-Founder</p>
                  </div>
                </div>
                
                <div className="mt-4 text-gray-700 space-y-4">
                  <p>
                    I'm building the future of finance automation, one workflow at a time. With deep roots in revenue recognition, reporting, and audit across global tech organizations, I've experienced firsthand the pain points that finance teams deal with daily.
                  </p>
                  <p>
                    That's exactly why PRA exists: to reimagine revenue intelligence through simplicity, automation, and precision. Before launching PRA, I led global revenue operations at a hypergrowth SaaS firm, managing complex revenue recognition models, monthly close cycles, audit readiness, and bad debt provisioning under IFRS.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Pratima - CFO */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary font-bold text-xl">
                    PN
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">Pratima Nemani</h3>
                    <p className="text-blue-600 font-medium">CFO & Co-Founder</p>
                  </div>
                </div>
                
                <div className="mt-4 text-gray-700 space-y-4">
                  <p>
                    I'm redefining finance automation for the modern enterprise. My passion lies at the intersection of numbers and strategy - turning financial complexity into clarity, and operational chaos into structure.
                  </p>
                  <p>
                    Before co-founding PRA, I played a pivotal role in revenue and financial reporting at a global tech company. From crafting investor decks that helped secure critical equity financing to driving market research initiatives alongside consultancy groups, I've worked across the entire finance spectrum – strategic, operational, and tactical.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-4">Why We Are the Right Team</h3>
            <p className="text-gray-700 mb-6">
              The synergy between our backgrounds forms the bedrock of our confidence in our ability to successfully deliver Precision Revenue Automation. Our deep-seated experience in revenue operations, including managing intricate revenue recognition models, monthly close cycles, audit readiness, and IFRS compliance at hypergrowth SaaS companies, provides invaluable insight into the core challenges our platform addresses.
            </p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">Deeply understand the problem: Firsthand experience with pain points in revenue lifecycle management</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">Build a robust solution: Technical and financial acumen to create a platform that is both innovative and practical</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">Execute effectively: Strategic and operational skills to navigate the complexities of bringing a product to market</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full">
                Leading the next wave of RevOps transformation
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-primary">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide every aspect of our product and company
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-primary mb-2">Trust & Integrity</h4>
              <p className="text-gray-700">We build software for financial reporting and compliance — trust is our foundation.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-primary mb-2">Innovation</h4>
              <p className="text-gray-700">We constantly innovate to solve complex financial challenges with elegant technology.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-primary mb-2">Customer Success</h4>
              <p className="text-gray-700">We measure our success by the success of our customers and their financial operations.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact CTA */}
      <div className="bg-primary py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">Ready to Transform Your Revenue Operations?</h2>
          <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto mb-8">
            Have questions about PRA? We'd love to hear from you and discuss how we can help automate and optimize your financial workflows.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/contact" className="px-6 py-3 bg-white text-primary font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Schedule a Demo
            </Link>
            <Link href="mailto:contact@pra.com" className="px-6 py-3 bg-transparent text-white font-medium rounded-full border border-white/30 hover:bg-white/10 transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}