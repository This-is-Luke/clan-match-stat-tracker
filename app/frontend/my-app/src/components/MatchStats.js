// src/components/MatchStats.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const MatchStats = ({ matchId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const doc = await db.collection('matches').doc(matchId).get();
      if (doc.exists) {
        setStats(doc.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchStats();
  }, [matchId]);

  return (
    <div>
      {stats ? (
        <div>
          <h2>Match Stats</h2>
          <p>Score: {stats.score}</p>
          <p>Players: {stats.players.join(', ')}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MatchStats;
