import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`${i < rating ? 'text-secondary' : 'text-gray-300'} ${i > 0 ? 'ml-1' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  rating: number;
  quote: string;
  author: {
    name: string;
    title: string;
    avatarUrl?: string;
  };
}

export function TestimonialCard({ rating, quote, author }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <StarRating rating={rating} />
      <blockquote className="text-neutral mb-4">
        "{quote}"
      </blockquote>
      <div className="flex items-center">
        <div className="mr-4">
          <Avatar className="h-12 w-12">
            {author.avatarUrl ? (
              <AvatarImage src={author.avatarUrl} alt={author.name} />
            ) : null}
            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{author.name}</p>
          <p className="text-xs text-neutral">{author.title}</p>
        </div>
      </div>
    </div>
  );
}
