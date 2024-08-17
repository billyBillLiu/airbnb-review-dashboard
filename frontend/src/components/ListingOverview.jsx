import { React, useState, useEffect } from "react";
import api from "../api";
import x_icon from "../assets/x_icon.png";
import LoadingIndicator from "./reusable/LoadingIndicator";
import generate_icon from "../assets/generate_icon.png";
import "../styles/ListingOverview.css";

function ListingOverview({ listing, reviews, refreshReviews, onClose }) {
  const [sentimentCount, setSentimentCount] = useState({});
  const [sentimentPercent, setSentimentPercent] = useState({});
  const [colorPercent, setColorPercent] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });
  const [loading, setLoading] = useState(false);

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

    if (Object.keys(listing.summary).length === 0) {
      generateSummary(listing.id);
    }
  }, []);

  const generateSummary = (id) => {
    setLoading(true);
    api
      .patch(`/api/listings/${id}/generate-summary/`)
      .then((res) => {
        if (res.status !== 200) alert("Failed to Generate Summary");
        refreshReviews();
      })
      .catch((err) => alert(`Error While Generating Summary: \n${err}`))
      .finally(() => setLoading(false));
  };

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
    return sentimentPercentages;
  };

  return (
    <div className="overview-overlay">
      <div className="overview-dialog">
        <div className="overview-title">{listing.name}</div>
        <button className="overview-close" onClick={onClose}>
          <img className="close-icon" src={x_icon} />
        </button>
        <div className="overview-content">
          <div className="overview-charts">
            <div
              className="pie-chart"
              style={{
                "--positive": `${colorPercent.positive}%`,
                "--neutral": `${colorPercent.neutral}%`,
                "--negative": `${colorPercent.negative}%`,
              }}
            >
              <div className="pie-chart-hole">
                <div className="review-count">{reviews.length}</div>
                <div className="percentages">
                  <span className="percentage-value positive">
                    {Math.round(colorPercent.positive)}%
                  </span>
                  |
                  <span className="percentage-value neutral">
                    {Math.round(colorPercent.neutral)}%
                  </span>
                  |
                  <span className="percentage-value negative">
                    {Math.round(colorPercent.negative)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="bar-chart">
              {Object.keys(sentimentCount)
                .sort((a, b) => sentimentCount[b] - sentimentCount[a])
                .map((key) => (
                  <div className="bar-row" key={key}>
                    <div className="bar-count">{sentimentCount[key]}</div>
                    <div className="bar-stack">
                      <div
                        className={`bar ${sentimentColorMap[key]}`}
                        style={{ width: `${sentimentPercent[key]}%` }}
                      />
                      <div className="bar-label">{key}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="overview-summary">
            <div className="summary-section">
              <div className="summary-title good">Strengths:</div>
              <div className="summary-text">
                {loading ? (
                  <LoadingIndicator />
                ) : Object.keys(listing.summary).length == 0 ? (
                  <LoadingIndicator />
                ) : (
                  listing.summary.strengths.map((item, index) => (
                    <div key={index}>
                      <div className="summary-text-header">{item.area}:</div>
                      <div className="summary-text-body">{item.reason}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="summary-section">
              <div className="summary-title bad">Weaknesses:</div>
              <div className="summary-text">
                {loading ? (
                  <LoadingIndicator className="summary-loading" />
                ) : Object.keys(listing.summary).length == 0 ? (
                  <LoadingIndicator className="summary-loading" />
                ) : (
                  listing.summary.weaknesses.map((item, index) => (
                    <div key={index}>
                      <div className="summary-text-header">{item.area}:</div>
                      <div className="summary-text-body">{item.reason}</div>
                    </div>
                  ))
                )}
              </div>
              {!listing.summary_up_to_date && (
                <div
                  className="update-summary-button"
                  onClick={() => generateSummary(listing.id)}
                >
                  <img className="generate-icon-image" src={generate_icon} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingOverview;
