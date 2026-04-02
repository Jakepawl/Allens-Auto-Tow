import { useState, useEffect } from 'preact/hooks';

interface Review {
  author: string;
  rating: number;
  date: string;
  body: string;
  service?: string;
  vehicle?: string;
}

function Stars({ count }: { count: number }) {
  return (
    <div class="flex gap-0.5" style="color: var(--color-star, #FBBF24)" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={i >= count ? { color: '#D1D5DB' } : undefined}>&#9733;</span>
      ))}
    </div>
  );
}

export default function TestimonialSlider({ reviews }: { reviews: Review[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % reviews.length), 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const review = reviews[current];

  return (
    <div class="max-w-2xl mx-auto text-center">
      <Stars count={review.rating} />
      <blockquote class="mt-4 text-gray-700 text-lg italic leading-relaxed">"{review.body}"</blockquote>
      <div class="mt-4">
        <div class="font-semibold text-gray-900">{review.author}</div>
        {review.vehicle && <div class="text-sm text-gray-500">{review.vehicle}</div>}
      </div>
      <div class="flex justify-center gap-2 mt-6">
        {reviews.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            class="w-2.5 h-2.5 rounded-full transition-colors cursor-pointer"
            style={{ backgroundColor: i === current ? 'var(--color-primary)' : '#D1D5DB' }}
            aria-label={`Show review ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
