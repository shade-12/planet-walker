import React from 'react';
import '../styles/App.css';

// React components import
import CubicSplineCanvas from './CubicSplineCanvas';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <CubicSplineCanvas />
      <Footer />
    </div>
  );
}

export default App;
