import React from 'react';
import '../styles/Community.css';

/**
 * Community
 * A simple static component displaying food-related community discussion posts.
 * Meant for user interaction, inspiration, and shared tips around dietary needs.
 */
const Community = () => {
  return (
    <div className="community-container">
      {/* Section Heading */}
      <h2>Community Discussions</h2>
      <p className="subheading">
        Connect, share, and learn with other health-focused foodies!
      </p>

      {/* List of hardcoded posts */}
      <div className="post-list">

        {/* Post #1: Dairy alternatives */}
        <div className="post-card">
          <h3>How do I substitute dairy in baking?</h3>
          <p>
            I’ve recently turned vegan. Any great alternatives for butter and milk in cakes?
          </p>
          <span className="user">@healthyBaker</span>
        </div>

        {/* Post #2: Nut-free snacks */}
        <div className="post-card">
          <h3>Nut-free snack ideas for kids?</h3>
          <p>
            Looking for allergy-safe snacks to pack for school.
          </p>
          <span className="user">@momof3</span>
        </div>

        {/* Post #3: Gluten-free pasta */}
        <div className="post-card">
          <h3>Best gluten-free pasta brands?</h3>
          <p>
            I want to switch, but taste really matters. Suggestions?
          </p>
          <span className="user">@fitnessguru</span>
        </div>

      </div>
    </div>
  );
};

export default Community;
