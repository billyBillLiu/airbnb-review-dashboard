import { React, useState, useEffect } from "react";
import api from "../api";
import x_icon from "../assets/x_icon.png";
import "../styles/ListingOverview.css";

function ListingOverview({ listing, reviews, onClose }) {
  const [sentimentCount, setSentimentCount] = useState({});
  const [sentimentPercent, setSentimentPercent] = useState({});
  const [colorPercent, setColorPercent] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });
  const [summary, setSummary] = useState({});

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

    setSummary(listing.summary);
    console.log("SUMMARY", listing.summary);
  }, []);

  const generateSummary = (id) => {
    api
      .patch(`/api/listings/${id}/generate-summary/`)
      .then((res) => {
        if (res.status !== 200) alert("Failed to Generate Summary");
      })
      .catch((err) => alert(`Error While Generating Summary: \n${err}`));
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
                <button onClick={() => generateSummary(listing.id)}>
                  {" "}
                  GENERATE{" "}
                </button>
              </div>
            </div>
            <div className="summary-section">
              <div className="summary-title bad">Weaknesses:</div>
              <div className="summary-text">
                {" "}
                THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A
                SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY{" "}
                THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A
                SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY
                THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A
                SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY
                THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A
                SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY
                THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A
                SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY
                THIS IS A SUMMARY THIS IS A SUMMARY THIS IS A SUMMARY{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingOverview;
