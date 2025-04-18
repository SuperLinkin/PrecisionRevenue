import { NavBar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Link } from 'wouter';

// Using the images from attached assets that have been copied to public/assets
const pranavImage = '/assets/pranav.png';
const pratimaImage = '/assets/pratima.png';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl mb-4 tracking-tight">About Us – PRA | Precision Revenue Automation</h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto font-light leading-relaxed">
              We're not just building software — we're rewriting the future of finance.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto text-gray-700 mb-16">
            <p className="text-lg leading-relaxed">
              PRA (Precision Revenue Automation) was born from lived chaos — built by finance professionals who spent years buried in spreadsheets, broken handoffs, and late-night audit checklists. We've felt the revenue leakage, dealt with ASC 606 / IFRS 15 nightmares, and battled siloed workflows across CRM, CPQ, Legal, and ERP.
            </p>
            <p className="text-lg leading-relaxed">
              So, we built PRA — an AI-native platform that thinks like finance and runs on autopilot. From decoding contracts to generating revenue schedules and forecasting cashflow, PRA empowers modern finance teams to automate what used to take weeks — in minutes.
            </p>
          </div>
          
          {/* Platform Overview Panel */}
          <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden mb-20">
            <div className="px-6 py-5 border-b border-gray-200 bg-primary text-white">
              <h3 className="text-xl tracking-wide">Platform & Market Overview</h3>
            </div>
            <div className="p-6">
              <div className="text-gray-600 space-y-4">
                <p>
                  Our revenue lifecycle automation platform is designed specifically for the modern B2B SaaS ecosystem. Targeting the urgent needs of mid-market and enterprise SaaS firms, especially those in North America, Europe, and India, our platform brings end-to-end automation to the revenue lifecycle—from quote to cash, contract intelligence, and compliance.
                </p>
                <p>
                  Built using an AI-native, modular architecture, we integrate Lovable AI for rapid UI deployment, Supabase for secure and scalable multi-tenant data handling, OpenAI GPT-4 for document and revenue intelligence, Dify for multi-agent workflows, and MCP for persistent AI context. Our system delivers real-time insights, automates high-complexity processes like clause extraction and revenue forecasting, and ensures compliance with ASC 606 and IFRS 15.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h4 className="text-lg text-primary">Market Opportunity</h4>
                  </div>
                  <p className="text-gray-600">$37.1B addressable market in revenue automation by 2030</p>
                </div>
                
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg text-primary">Target Segment</h4>
                  </div>
                  <p className="text-gray-600">Mid-market and enterprise SaaS firms in North America, Europe, and India</p>
                </div>
                
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-lg text-primary">Competitive Edge</h4>
                  </div>
                  <p className="text-gray-600">AI-powered, flexible, and affordable solution for the underserved mid-market</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Leadership Team - Co-founders */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-primary mb-4">Leadership Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the team that's revolutionizing revenue automation
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Pranav - CEO */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                <div className="flex flex-col">
                  <div className="border-b border-gray-100 pb-3 mb-4">
                    <h3 className="text-2xl text-primary">Pranav MV</h3>
                    <p className="text-blue-600">CEO & Co-Founder</p>
                  </div>
                  
                  <div className="text-gray-600 space-y-4">
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
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                <div className="flex flex-col">
                  <div className="border-b border-gray-100 pb-3 mb-4">
                    <h3 className="text-2xl text-primary">Pratima Nemani</h3>
                    <p className="text-blue-600">CFO & Co-Founder</p>
                  </div>
                  
                  <div className="text-gray-600 space-y-4">
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
          </div>
          
          {/* Why We Are the Right Team */}
          <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden mb-20">
            <div className="p-8">
              <h3 className="text-2xl text-primary mb-4">Why We Are the Right Team</h3>
              <p className="text-gray-600 mb-6">
                The synergy between our backgrounds forms the bedrock of our confidence in our ability to successfully deliver Precision Revenue Automation. Our deep-seated experience in revenue operations, including managing intricate revenue recognition models, monthly close cycles, audit readiness, and IFRS compliance at hypergrowth SaaS companies, provides invaluable insight into the core challenges our platform addresses.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Deeply understand the problem: Firsthand experience with pain points in revenue lifecycle management</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Build a robust solution: Technical and financial acumen to create a platform that is both innovative and practical</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Execute effectively: Strategic and operational skills to navigate the complexities of bringing a product to market</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact CTA */}
      <div className="bg-primary py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl text-white mb-4">Ready to Transform Your Revenue Operations?</h2>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8">
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