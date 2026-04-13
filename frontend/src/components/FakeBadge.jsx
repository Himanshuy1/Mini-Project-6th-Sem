import React from 'react';

const FakeBadge = ({ prediction, confidenceScore, reason }) => {
  let badgeClass = 'badge-uncertain';
  let icon = '⚠️';

  if (prediction?.toLowerCase() === 'real') {
    badgeClass = 'badge-real';
    icon = '✅';
  } else if (prediction?.toLowerCase() === 'fake') {
    badgeClass = 'badge-fake';
    icon = '❌';
  } else if (prediction?.toLowerCase() === 'misleading') {
    badgeClass = 'badge-uncertain';
    icon = '⚠️';
  }

  const scoreLabel = (confidenceScore && prediction?.toLowerCase() !== 'real') ? `(${confidenceScore}%)` : '';

  return (
    <div className={`fake-badge ${badgeClass}`} title={reason ? `AI Reason: ${reason}` : ''}>
      <span className="badge-icon">{icon}</span>
      <span className="badge-text">{prediction} {scoreLabel}</span>
    </div>
  );
};

export default FakeBadge;
