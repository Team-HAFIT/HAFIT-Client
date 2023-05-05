import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

// import './App.css';

// import Header from './components/Navbar';

import LandingPage from './pages/LandingPage';
import NoticePage from './pages/NoticePage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage'; 

import Main from './pages/Main';

import Test from './pages/test';
import Test2 from './pages/Test2';
import ExecTest from './pages/TestSquat';

function App() {
  return (
    <Router>
      <div>
        {/* <Header /> */}
        {/* <NavbarTest /> */}
        {/* <NavbarTest2 /> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/intro" element={<LandingPage />} /> 
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />

          <Route path="/main" element={<Main />} />

          <Route path="/test" element={<Test />} />
          <Route path="/test2" element={<Test2 />} />
          <Route path="/exectest" element={<ExecTest />} />
        </Routes>
        
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
