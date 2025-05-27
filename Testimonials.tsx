import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "I never shop online without checking beingByte first. It's saved me thousands of rupees on electronics purchases this year alone!",
      author: "Priya S.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      quote: "beingByte saved me so much time and money! Found the best price for my new laptop in seconds, complete with all the available offers.",
      author: "Alex R.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.5
    },
    {
      quote: "Simple, fast, and effective. I love the price history feature that helps me know when it's the right time to buy. Already recommended to all my friends!",
      author: "Mark T.",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg",
      rating: 5
    }
  ];

  // Render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="text-yellow-400 text-sm">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`star-${i}`} className="inline-block fill-current h-4 w-4" />
        ))}
        {hasHalfStar && <Star className="inline-block fill-current h-4 w-4" />}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
          <Star key={`empty-star-${i}`} className="inline-block h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <section className="bg-gray-50 py-16" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thousands of shoppers are already saving time and money with beingByte.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={`Profile photo of ${testimonial.author}`} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">{testimonial.author}</h4>
                  {renderRating(testimonial.rating)}
                </div>
              </div>
              <p className="text-gray-600 italic">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
