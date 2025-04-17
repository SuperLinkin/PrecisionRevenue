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
              <div className="bg-white/10 rounded-lg p-8 backdrop-blur">
                <div className="rounded-lg shadow-xl bg-white p-2">
                  <svg
                    className="w-full h-64"
                    viewBox="0 0 600 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="600" height="400" rx="8" fill="#F8FAFC" />
                    <rect x="20" y="20" width="560" height="60" rx="4" fill="#0F172A" />
                    <rect x="40" y="40" width="120" height="20" rx="4" fill="#3B82F6" />
                    <rect x="400" y="40" width="80" height="20" rx="4" fill="#FFFFFF" />
                    <rect x="500" y="40" width="60" height="20" rx="4" fill="#22C55E" />
                    <rect x="20" y="100" width="180" height="120" rx="4" fill="#FFFFFF" />
                    <rect x="40" y="120" width="140" height="10" rx="2" fill="#0F172A" />
                    <rect x="40" y="140" width="120" height="60" rx="2" fill="#3B82F6" opacity="0.2" />
                    <rect x="220" y="100" width="180" height="120" rx="4" fill="#FFFFFF" />
                    <rect x="240" y="120" width="140" height="10" rx="2" fill="#0F172A" />
                    <rect x="240" y="140" width="120" height="60" rx="2" fill="#22C55E" opacity="0.2" />
                    <rect x="420" y="100" width="180" height="120" rx="4" fill="#FFFFFF" />
                    <rect x="440" y="120" width="140" height="10" rx="2" fill="#0F172A" />
                    <rect x="440" y="140" width="120" height="60" rx="2" fill="#F59E0B" opacity="0.2" />
                    <rect x="20" y="240" width="580" height="140" rx="4" fill="#FFFFFF" />
                    <rect x="40" y="260" width="140" height="10" rx="2" fill="#0F172A" />
                    <rect x="40" y="280" width="540" height="80" rx="2" fill="#3B82F6" opacity="0.1" />
                    <path d="M40 320 L120 300 L200 310 L280 290 L360 280 L440 290 L520 270 L580 280" stroke="#3B82F6" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-primary">Our Comprehensive Solution Suite</h2>
            <p className="mt-4 text-lg text-neutral">
              PRA's integrated tools work together to streamline your financial operations.
            </p>
          </div>
          <div className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
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
      <div className="bg-background">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-primary">Trusted by Financial Leaders</h2>
            <p className="mt-4 text-lg text-neutral">
              See how PRA is transforming financial operations across industries.
            </p>
          </div>
          <div className="mt-12 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                rating={testimonial.rating}
                quote={testimonial.quote}
                author={testimonial.author}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to streamline your revenue operations?</span>
            <span className="block text-secondary">Request a demo today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/signup">
                <Button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50">
                  Request Demo
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/knowledge-center">
                <Button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary hover:bg-blue-600">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
