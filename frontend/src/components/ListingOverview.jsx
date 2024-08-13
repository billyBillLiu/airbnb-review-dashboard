import { React, useState, useEffect } from "react";
import "../styles/ListingOverview.css";

function ListingOverview({ listing, reviews, onClose }) {
  const [sentimentCount, setSentimentCount] = useState({});
  const [percentages, setPercentages] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });

  const sentimentColorMap = {
    love: "positive",
    admiration: "positive",
    joy: "positive",
    approval: "positive",
    gratitude: "positive",
    excitement: "positive",
    optimism: "positive",
    caring: "positive",
    pride: "positive",
    relief: "positive",
    amusement: "positive",

    curiosity: "neutral",
    realization: "neutral",
    surprise: "neutral",
    neutral: "neutral",
    confusion: "neutral",
    desire: "neutral",

    nervousness: "negative",
    remorse: "negative",
    sadness: "negative",
    embarrassment: "negative",
    grief: "negative",
    fear: "negative",
    disapproval: "negative",
    disappointment: "negative",
    annoyance: "negative",
    disgust: "negative",
    anger: "negative",
  };

  useEffect(() => {
    const count = countSentiments(reviews);
    const percentages = calculatePercentages(count);
    setSentimentCount(count);
    setPercentages(percentages);
  }, []);

  const countSentiments = (reviews) => {
    return reviews.reduce((acc, review) => {
      const sentiment = review.sentiment;
      if (!acc[sentiment]) {
        acc[sentiment] = 0;
      }
      acc[sentiment] += 1;
      return acc;
    }, {});
  };

  const calculatePercentages = (sentimentCount) => {
    const colorCount = { positive: 0, neutral: 0, negative: 0 };
    let total = 0;
    for (const sentiment in sentimentCount) {
      const color = sentimentColorMap[sentiment];
      colorCount[color] += sentimentCount[sentiment];
      total += sentimentCount[sentiment];
    }
    const percentages = {
      positive: (colorCount.positive / total) * 100,
      neutral: (colorCount.neutral / total) * 100,
      negative: (colorCount.negative / total) * 100,
    };

    return percentages;
  };

  return (
    <div className="overview-overlay">
      <div className="overview-dialog">
        <p>
          {reviews.length} Reviews for {listing.name}:
        </p>
        <div
          className="overview-chart"
          style={{
            "--positive": `${percentages.positive}%`,
            "--neutral": `${percentages.neutral}%`,
            "--negative": `${percentages.negative}%`,
          }}
        >
          <div className="chart-hole">
            <div className="overview-percentages">
              <div className="percentage-row">
                <span className="label">Positive:</span>
                <span className="value positive">
                  {Math.round(percentages.positive)}%
                </span>
              </div>
              <div className="percentage-row">
                <span className="label">Neutral:</span>
                <span className="value neutral">
                  {Math.round(percentages.neutral)}%
                </span>
              </div>
              <div className="percentage-row">
                <span className="label">Negative:</span>
                <span className="value negative">
                  {Math.round(percentages.negative)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <button className="overview-close" onClick={onClose}>
          CLOSE
        </button>
      </div>
    </div>
  );
}

export default ListingOverview;
