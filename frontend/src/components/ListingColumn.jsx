import Review from "../components/Review";
import Listing from "../components/Listing";
import "../styles/ListingColumn.css";

function ListingColumn({ reviews, onDelete, refreshReviews }) {
  const listing = reviews[0].listing ? reviews[0].listing : null;
  return (
    <div className="listing-column">
      <Listing
        listing={listing}
        reviews={reviews}
        refreshReviews={refreshReviews}
      />
      <div className="reviews-container">
        {reviews.map((review) => (
          <Review review={review} onDelete={onDelete} key={review.id} />
        ))}
      </div>
    </div>
  );
}

export default ListingColumn;
