import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import './App.css';

// Main Layout
import MainLayout from "./layout/MainLayout";

// 공통
//------ Header 예외 처리를 위한 MainLayout을 사용함에 따라 주석 처리 ------//
//------ 2023. 05. 19 (금) 13:04 -------------//
// import Header from "./components/Navbar";
import PreparingPage from "./pages/PreparingPage";

// 비회원
import LandingPage from "./pages/LandingPage";
import NoticePage from "./pages/NoticePage";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";

// 회원
import LoginMain from "./pages/LoginMain";
import EditMyInfo from "./pages/user/EditMyInfo";

// 운동 : 공통
import RestTimerPage from "./pages/exercises/RestTimerPage";

// 운동 : 스쿼트
import SquatSetting from "./pages/exercises/squat/SquatSetting";
import SquatResult from "./pages/exercises/squat/SquatResult";

// 커뮤니티
import ViewPostsAll from "./pages/community/ViewPostsAll";

// 테스트용
import Test from "./pages/test";
import Test2 from "./pages/Test2";

// 임시 사용
import ExecStatsPage from "./pages/exercises/ExecStatsPage";

function App() {
  return (
    <Router>
      <div>
        {/* <Header /> */}
        <Routes>
          {/*공통 Header를 포함하는 컴포넌트 */}
          <Route element={<MainLayout />}>
            {/* 공통 */}
            <Route path="/prepare" element={<PreparingPage />} />

            {/* 비회원 */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/intro" element={<LandingPage />} />
            <Route path="/notice" element={<NoticePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/join" element={<JoinPage />} />

            {/* 회원 */}
            <Route path="/main" element={<LoginMain />} />
            <Route path="/mainpage" element={<LoginMain />} />
            <Route path="/user/info" element={<EditMyInfo />} />

            {/* 운동 */}
            <Route path="/squat/setting" element={<SquatSetting />} />
            <Route path="/exec/result" element={<SquatResult />} />
            <Route path="/exec/rest" element={<RestTimerPage />} />
            
            {/* 테스트용 */}
            <Route path="/test" element={<Test />} />
            <Route path="/test2" element={<Test2 />} />

            {/* 임시 사용 */}
            <Route path="/stats" element={<ExecStatsPage />} />
          </Route>

          {/* 공통 Header를 포함하지 않는 컴포넌트 */}
          {/* 커뮤니티 */}
          {/* <Route path="/community/main" element={<ViewPostsAll />} /> */}
          <Route path="/community/*" element={<CommunityRoutes />} />
        </Routes>
      </div>
    </Router>
  );
}

function CommunityRoutes() {
  return (
    <Routes>
      {/* /community 경로에 대한 중첩 라우트 */}
      <Route path="/main" element={<ViewPostsAll />} />
      {/* <Route path=":postId" element={<ViewPostDetails />} /> */}
    </Routes>
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
