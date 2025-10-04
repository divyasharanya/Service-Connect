import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const RatingModal = ({ booking, isOpen, onClose, onSubmitRating }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (rating === 0) return;
    
    onSubmitRating({
      bookingId: booking?.id,
      rating,
      review: review?.trim()
    });
    
    // Reset form
    setRating(0);
    setReview('');
    onClose();
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
          onMouseLeave={handleStarLeave}
          className="p-1 transition-micro hover:scale-110"
        >
          <Icon
            name="Star"
            size={32}
            className={isActive ? "text-warning fill-current" : "text-muted-foreground hover:text-warning"}
          />
        </button>
      );
    });
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select a rating';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-floating max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Rate Your Service</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="h-8 w-8 p-0"
          />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Info */}
          <div className="text-center">
            <h3 className="font-medium text-foreground">{booking?.serviceType}</h3>
            <p className="text-sm text-muted-foreground">with {booking?.technicianName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(booking.date)?.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Rating Stars */}
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">How was your experience?</p>
            <div className="flex justify-center space-x-1">
              {renderStars()}
            </div>
            <p className="text-sm text-muted-foreground">
              {getRatingText(hoveredRating || rating)}
            </p>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Share your experience (optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e?.target?.value)}
              placeholder="Tell us about your experience with this service..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {review?.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={rating === 0}
              fullWidth
            >
              Submit Rating
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;