import { React, useState, useEffect } from "react";
import "../styles/ListingOverview.css";

function ListingOverview({ listing, reviews, onClose }) {
  const [sentimentCount, setSentimentCount] = useState({});
  const [sentimentPercent, setSentimentPercent] = useState({});
  const [colorPercent, setColorPercent] = useState({
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
    const sentimentCount = countSentiments(reviews);
    setSentimentCount(sentimentCount);

    const colorPercent = calculateColorPercent(sentimentCount);
    setColorPercent(colorPercent);

    const sentimentPercent = calculateSentimentPercent(sentimentCount);
    setSentimentPercent(sentimentPercent);
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

  const calculateColorPercent = (sentimentCount) => {
    const colorCount = { positive: 0, neutral: 0, negative: 0 };
    let total = 0;
    for (const sentiment in sentimentCount) {
      const color = sentimentColorMap[sentiment];
      colorCount[color] += sentimentCount[sentiment];
      total += sentimentCount[sentiment];
    }
    const colorPercentages = {
      positive: (colorCount.positive / total) * 100,
      neutral: (colorCount.neutral / total) * 100,
      negative: (colorCount.negative / total) * 100,
    };
    return colorPercentages;
  };

  const calculateSentimentPercent = (sentimentCount) => {
    const maxCount = Math.max(...Object.values(sentimentCount));
    let sentimentPercentages = {};
    for (const sentiment in sentimentCount) {
      sentimentPercentages[sentiment] =
        (sentimentCount[sentiment] / maxCount) * 100;
    }
    console.log(sentimentPercentages);
    return sentimentPercentages;
  };

  return (
    <div className="overview-overlay">
      <div className="overview-dialog">
        <div className="overview-title">
          {reviews.length} Reviews for {listing.name}:
        </div>
        <div
          className="overview-pie-chart"
          style={{
            "--positive": `${colorPercent.positive}%`,
            "--neutral": `${colorPercent.neutral}%`,
            "--negative": `${colorPercent.negative}%`,
          }}
        >
          <div className="pie-chart-hole">
            <div className="overview-percentages">
              <div className="percentage-row">
                <span className="percentage-label">Positive:</span>
                <span className="percentage-value positive">
                  {Math.round(colorPercent.positive)}%
                </span>
              </div>
              <div className="percentage-row">
                <span className="percentage-label">Neutral:</span>
                <span className="percentage-value neutral">
                  {Math.round(colorPercent.neutral)}%
                </span>
              </div>
              <div className="percentage-row">
                <span className="percentage-label">Negative:</span>
                <span className="percentage-value negative">
                  {Math.round(colorPercent.negative)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bar-chart">
          {Object.keys(sentimentCount)
            .sort((a, b) => sentimentCount[b] - sentimentCount[a])
            .map((key, index) => (
              <div className="bar-row">
                <div className="bar-value">{sentimentCount[key]}</div>
                <div className="bar-stack">
                  <div
                    key={index}
                    className={`bar ${sentimentColorMap[key]}`}
                    style={{ width: `${sentimentPercent[key]}%` }}
                  />
                  <div className="bar-label">{key}</div>
                </div>
              </div>
            ))}
        </div>
        <button className="overview-close" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}

export default ListingOverview;
