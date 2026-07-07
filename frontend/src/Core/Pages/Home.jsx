import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Jelyco Warehouse</h1>
      <p>Select a section:</p>
      <ul>
        <li><Link to="/suppliers">Suppliers</Link></li>
        <li><Link to="/items">Items</Link></li>
      </ul>
    </div>
  );
};

export default Home;