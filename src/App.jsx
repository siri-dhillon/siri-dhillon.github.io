import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProfessionalYou from './pages/ProfessionalYou'; // Import the new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project-ai" element={<ProfessionalYou />} />
      </Routes>
    </Router>
  );
}

export default App;