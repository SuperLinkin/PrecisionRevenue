import { motion } from 'framer-motion';

interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className={`text-lg ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          } mr-1`}
        >
          ★
        </motion.span>
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
    <motion.div
      className="bg-white shadow-xl rounded-xl p-6 overflow-hidden relative border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-secondary/10 rounded-full blur-xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-primary/10 rounded-full blur-xl opacity-70"></div>
      
      <div className="relative">
        <div className="mb-4">
          <StarRating rating={rating} />
        </div>
        
        <blockquote className="text-gray-700 mb-6 relative">
          <span className="absolute top-0 left-0 text-6xl text-secondary/20 -mt-6 -ml-2">❝</span>
          <p className="relative z-10 italic pt-3 pl-4">{quote}</p>
        </blockquote>
        
        <div className="flex items-center">
          {author.avatarUrl ? (
            <div className="flex-shrink-0 mr-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-secondary/20">
                <img src={author.avatarUrl} alt={author.name} className="h-full w-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0 mr-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-primary/70 flex items-center justify-center text-white font-semibold">
                {author.name.substring(0, 1)}
              </div>
            </div>
          )}
          
          <div>
            <div className="font-medium text-primary">{author.name}</div>
            <div className="text-sm text-gray-500">{author.title}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}