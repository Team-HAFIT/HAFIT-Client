import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import './App.css';

import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

/* 초기 연동 테스트
 * 추후 삭제 !
function App() {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    fetch("/hello")
        .then((response) => {
            return response.json();
        })
        .then(function (data) {
            setMessage(data);
        });
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <ul>
          {message.map((text, index) => <li key={`${index}-${text}`}>{text}</li>)}
        </ul>
        <p>Git 테스트 (정훈)</p>
        <p>Git 테스트 (준규)</p>
      </header>
    </div>
  );
}
*/

export default App;
