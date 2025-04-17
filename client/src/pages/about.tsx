import { NavBar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">About PRA</h1>
            <p className="mt-4 text-xl max-w-3xl mx-auto">
              Leading the way in revenue automation and financial compliance
            </p>
          </div>
        </div>
      </div>
      
      {/* Company Overview */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-primary">Our Mission</h2>
            <p className="mt-4 text-lg text-neutral max-w-3xl mx-auto">
              We're on a mission to simplify revenue recognition, contract management, and compliance for finance teams worldwide.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Company Story</h3>
              <p className="text-neutral mb-4">
                Founded in 2020 by a team of finance and technology experts, PRA was born from first-hand experience with the challenges of revenue recognition under ASC 606 and IFRS 15 standards.
              </p>
              <p className="text-neutral mb-4">
                Our founders spent years managing complex revenue operations at enterprise SaaS companies and saw the need for a more intelligent, automated approach to revenue management.
              </p>
              <p className="text-neutral">
                Today, PRA serves hundreds of finance departments across industries, helping them automate their revenue operations and stay compliant with evolving accounting standards.
              </p>
            </div>
            <div className="bg-secondary/10 rounded-lg p-8">
              <div className="aspect-w-16 aspect-h-9 rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 600 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="600" height="400" rx="8" fill="#F8FAFC" />
                  <path
                    d="M300 80C280 80 240 100 240 180C240 260 300 320 300 320C300 320 360 260 360 180C360 100 320 80 300 80Z"
                    fill="#3B82F6"
                    opacity="0.2"
                  />
                  <path
                    d="M300 80C280 80 240 100 240 180C240 260 300 320 300 320"
                    stroke="#3B82F6"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M300 320C300 320 360 260 360 180C360 100 320 80 300 80"
                    stroke="#3B82F6"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <circle cx="300" cy="160" r="30" fill="#3B82F6" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-primary mb-6 text-center">Our Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg">
                <div className="text-secondary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">Trust & Integrity</h4>
                <p className="text-neutral">We build software for financial reporting and compliance — trust is our foundation.</p>
              </div>
              
              <div className="bg-background p-6 rounded-lg">
                <div className="text-secondary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">Innovation</h4>
                <p className="text-neutral">We constantly innovate to solve complex financial challenges with elegant technology.</p>
              </div>
              
              <div className="bg-background p-6 rounded-lg">
                <div className="text-secondary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">Customer Success</h4>
                <p className="text-neutral">We measure our success by the success of our customers and their financial operations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leadership Team */}
      <div className="bg-background py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-primary">Leadership Team</h2>
            <p className="mt-4 text-lg text-neutral max-w-3xl mx-auto">
              Meet the team of finance and technology experts behind PRA
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Jennifer Chen',
                title: 'CEO & Co-Founder',
                bio: 'Former CFO with 15 years of experience in SaaS finance and accounting'
              },
              {
                name: 'Michael Rodriguez',
                title: 'CTO & Co-Founder',
                bio: 'Software architect specializing in financial systems and machine learning'
              },
              {
                name: 'David Thompson',
                title: 'Chief Revenue Officer',
                bio: 'Revenue operations expert with background in enterprise financial software'
              },
              {
                name: 'Sarah Williams',
                title: 'Chief Product Officer',
                bio: 'Product leader focused on building intuitive financial tools'
              },
              {
                name: 'Robert Johnson',
                title: 'VP of Customer Success',
                bio: 'Dedicated to ensuring customers maximize value from our platform'
              },
              {
                name: 'Emily Martinez',
                title: 'VP of Compliance',
                bio: 'CPA with expertise in revenue recognition standards and compliance'
              }
            ].map((person, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-secondary">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-primary">{person.name}</h4>
                  <p className="text-secondary font-medium text-sm mb-2">{person.title}</p>
                  <p className="text-neutral text-center text-sm">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Contact CTA */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-primary">Get in Touch</h2>
          <p className="mt-4 text-lg text-neutral max-w-3xl mx-auto mb-8">
            Have questions about PRA? We'd love to hear from you and discuss how we can help with your revenue automation needs.
          </p>
          <div className="inline-flex rounded-md shadow">
            <a href="mailto:contact@pra.com" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary hover:bg-blue-600">
              Contact Us
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
