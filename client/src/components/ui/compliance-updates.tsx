import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { InfoIcon, CheckCircleIcon, ExternalLinkIcon } from 'lucide-react';

const complianceUpdates = [
  {
    id: 1,
    title: 'ASC 606 Quarterly Update',
    content: 'The FASB has released clarifications for performance obligations in SaaS contracts.',
    linkText: 'Read more',
    linkUrl: '#',
    type: 'info',
  },
  {
    id: 2,
    title: 'IFRS 15 Reminder',
    content: 'Annual disclosure requirements are due for international entities.',
    linkText: 'Review checklist',
    linkUrl: '#',
    type: 'info',
  },
  {
    id: 3,
    title: 'Compliance Review Completed',
    content: 'Your team has successfully completed the quarterly compliance review.',
    linkText: 'View report',
    linkUrl: '#',
    type: 'success',
  },
];

export function ComplianceUpdates() {
  return (
    <Card>
      <CardHeader className="px-5 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-primary">Compliance Updates</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <ul className="divide-y divide-gray-200">
          {complianceUpdates.map((update) => (
            <li key={update.id} className="py-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  {update.type === 'info' ? (
                    <InfoIcon className="h-5 w-5 text-secondary" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 text-accent" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-primary">{update.title}</p>
                  <p className="text-xs text-neutral">{update.content}</p>
                  <a href={update.linkUrl} className="text-xs text-secondary hover:text-blue-600 inline-flex items-center">
                    {update.linkText}
                    <ExternalLinkIcon className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
