import { React, useState } from "react";
import Review from "../components/Review";
import Listing from "../components/Listing";
import ListingOverview from "./ListingOverview";
import "../styles/ListingColumn.css";

function ListingColumn({ reviews, onDelete, refreshReviews }) {
  const [overviewVisible, setOverviewVisible] = useState(false);

  const listing = reviews[0].listing ? reviews[0].listing : null;

  const showOverview = () => {
    setOverviewVisible(true);
  };

  const hideOverview = () => {
    setOverviewVisible(false);
  };

  return (
    <div className="listing-column">
      <Listing
        listing={listing}
        onShowOverview={showOverview}
        refreshReviews={refreshReviews}
      />
      <div className="reviews-container">
        {reviews.map((review) => (
          <Review review={review} onDelete={onDelete} key={review.id} />
        ))}
      </div>
      {overviewVisible && (
        <ListingOverview
          listing={listing}
          reviews={reviews}
          refreshReviews={refreshReviews}
          onClose={hideOverview}
        />
      )}
    </div>
  );
}

export default ListingColumn;
