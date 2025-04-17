import { NavBar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircleIcon, BookOpenIcon, FileTextIcon, BookIcon } from 'lucide-react';

export default function KnowledgeCenter() {
  const resources = [
    {
      title: 'Understanding ASC 606',
      description: 'A comprehensive guide to ASC 606 revenue recognition standards for finance professionals.',
      type: 'guide',
      readTime: '15 min read'
    },
    {
      title: 'IFRS 15 Compliance Checklist',
      description: 'Essential compliance checklist for international accounting standards on revenue recognition.',
      type: 'template',
      readTime: '10 min read'
    },
    {
      title: 'Revenue Recognition Best Practices',
      description: 'Key strategies and best practices for implementing effective revenue recognition processes.',
      type: 'whitepaper',
      readTime: '20 min read'
    },
    {
      title: 'Performance Obligation Identification',
      description: 'How to properly identify and account for performance obligations in complex contracts.',
      type: 'guide',
      readTime: '12 min read'
    },
    {
      title: 'Variable Consideration Estimation',
      description: 'Strategies for accurate estimation and constraint of variable consideration in revenue contracts.',
      type: 'guide',
      readTime: '15 min read'
    },
    {
      title: 'Revenue Recognition Policy Template',
      description: 'A customizable template for developing a comprehensive revenue recognition policy for your organization.',
      type: 'template',
      readTime: '8 min read'
    }
  ];

  const faqs = [
    {
      question: 'What are the five steps of revenue recognition under ASC 606?',
      answer: 'The five steps are: 1) Identify the contract with a customer, 2) Identify the performance obligations, 3) Determine the transaction price, 4) Allocate the transaction price to the performance obligations, and 5) Recognize revenue when or as performance obligations are satisfied.'
    },
    {
      question: 'How is IFRS 15 different from ASC 606?',
      answer: 'While IFRS 15 and ASC 606 were developed jointly and are substantially converged, there are minor differences in implementation guidance, disclosures, and effective dates. Both standards follow the same core principles and five-step model.'
    },
    {
      question: 'What is a performance obligation?',
      answer: 'A performance obligation is a promise in a contract with a customer to transfer a good or service to the customer. It must be distinct within the context of the contract and be separately identifiable from other promises.'
    },
    {
      question: 'How should variable consideration be handled?',
      answer: 'Variable consideration should be estimated using either the expected value method or the most likely amount method, depending on which better predicts the amount of consideration. It should then be constrained to an amount that is highly probable not to result in a significant revenue reversal.'
    },
    {
      question: 'When should revenue be recognized over time vs. at a point in time?',
      answer: 'Revenue should be recognized over time if one of these criteria is met: 1) The customer simultaneously receives and consumes the benefits, 2) The entity\'s performance creates or enhances an asset controlled by the customer, or 3) The entity\'s performance doesn\'t create an asset with alternative use and the entity has an enforceable right to payment for performance completed to date. Otherwise, revenue is recognized at a point in time.'
    }
  ];

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'guide':
        return <BookOpenIcon className="h-6 w-6 text-secondary" />;
      case 'template':
        return <FileTextIcon className="h-6 w-6 text-accent" />;
      case 'whitepaper':
        return <BookIcon className="h-6 w-6 text-primary" />;
      default:
        return <BookOpenIcon className="h-6 w-6 text-secondary" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">Knowledge Center</h1>
            <p className="mt-4 text-xl max-w-3xl mx-auto">
              Resources, guides, and best practices for revenue recognition and compliance
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-3">
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="standards">Standards</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resources">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        {getResourceTypeIcon(resource.type)}
                        <div className="ml-4">
                          <div className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-secondary/10 text-secondary mb-2">
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </div>
                          <h3 className="text-lg font-semibold text-primary">{resource.title}</h3>
                          <p className="text-sm text-neutral mt-1">{resource.description}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-neutral">{resource.readTime}</span>
                            <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary/80">
                              Read more
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="standards">
              <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-start mb-6">
                      <div className="flex-shrink-0">
                        <div className="rounded-full bg-secondary/10 p-3">
                          <FileTextIcon className="h-6 w-6 text-secondary" />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-2xl font-bold text-primary">ASC 606: Revenue from Contracts with Customers</h3>
                        <p className="mt-2 text-neutral">
                          Issued by the Financial Accounting Standards Board (FASB), ASC 606 establishes a comprehensive framework for recognizing revenue from customer contracts.
                        </p>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-border rounded-md p-4">
                            <h4 className="font-semibold text-primary mb-2">Core Principle</h4>
                            <p className="text-sm text-neutral">
                              Recognize revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services.
                            </p>
                          </div>
                          <div className="border border-border rounded-md p-4">
                            <h4 className="font-semibold text-primary mb-2">Effective Date</h4>
                            <p className="text-sm text-neutral">
                              Public entities: Annual reporting periods beginning after December 15, 2017<br />
                              All other entities: Annual reporting periods beginning after December 15, 2018
                            </p>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button className="bg-secondary hover:bg-blue-600 text-white">
                            ASC 606 Implementation Guide
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-start mb-6">
                      <div className="flex-shrink-0">
                        <div className="rounded-full bg-secondary/10 p-3">
                          <FileTextIcon className="h-6 w-6 text-secondary" />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-2xl font-bold text-primary">IFRS 15: Revenue from Contracts with Customers</h3>
                        <p className="mt-2 text-neutral">
                          Issued by the International Accounting Standards Board (IASB), IFRS 15 provides a single, comprehensive revenue recognition model for all contracts with customers.
                        </p>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-border rounded-md p-4">
                            <h4 className="font-semibold text-primary mb-2">Core Principle</h4>
                            <p className="text-sm text-neutral">
                              Recognize revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services.
                            </p>
                          </div>
                          <div className="border border-border rounded-md p-4">
                            <h4 className="font-semibold text-primary mb-2">Effective Date</h4>
                            <p className="text-sm text-neutral">
                              Annual reporting periods beginning on or after January 1, 2018, with earlier application permitted.
                            </p>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button className="bg-secondary hover:bg-blue-600 text-white">
                            IFRS 15 Implementation Guide
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="faq">
              <div className="max-w-4xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          <CheckCircleIcon className="h-6 w-6 text-secondary" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-primary">{faq.question}</h3>
                          <p className="mt-2 text-neutral">{faq.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Specialized Guidance?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Our team of financial experts can provide personalized assistance with your revenue recognition challenges.
          </p>
          <Button className="bg-white text-primary hover:bg-gray-100">
            Contact Our Experts
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
