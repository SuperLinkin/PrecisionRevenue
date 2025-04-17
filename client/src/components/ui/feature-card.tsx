import { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  icon: ReactNode;
}

export function FeatureCard({ title, description, features, icon }: FeatureCardProps) {
  return (
    <div className="relative">
      <div className="bg-secondary/10 p-5 rounded-lg">
        <div className="flex items-center mb-2">
          {icon}
          <h3 className="text-xl leading-6 font-bold text-primary ml-2">{title}</h3>
        </div>
        <p className="text-base text-neutral">{description}</p>
        <ul className="mt-4 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="text-secondary mr-2">✓</span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
