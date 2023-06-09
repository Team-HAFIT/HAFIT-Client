import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// 레이아웃
import MainLayout from "./layout/MainLayout";
import CommunityLayout from "./layout/community/CommunityLayout";

// 공통
import PreparingPage from "./pages/PreparingPage";
import KakaoRedirectHandler from "./components/oauth/kakao/KakaoRedirectHandler";
//------ Header 예외 처리를 위한 MainLayout을 사용함에 따라 주석 처리 ------//
// import Header from "./components/Navbar";

// JWT
// import Login from './pages/Login';
import Logout from "./components/Logout";

// 비회원
import LandingPage from "./pages/LandingPage";
import NoticePage from "./pages/NoticePage";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";

// 회원
import LoginMain from "./pages/LoginMain";
import EditMyInfo from "./pages/user/EditMyInfo";
import EditPwd from "./pages/user/EditPwd";

// 운동 : 공통
import RestTimerPage from "./pages/exercises/RestTimerPage";

// 운동 : 스쿼트
import SquatSetting from "./pages/exercises/squat/SquatSetting";
import SquatResult from "./pages/exercises/squat/SquatResult";
import SquatExec from "./pages/exercises/squat/SquatExec";

// 커뮤니티
import PostsAll from "./pages/community/view-posts/PostsAll";
import CategoryFotd from "./pages/community/view-posts/CategoryFotd";
import CategoryFeedback from "./pages/community/view-posts/CategoryFeedback";
import CategoryQnA from "./pages/community/view-posts/CategoryQnA";
import CategoryFreeBoard from "./pages/community/view-posts/CategoryFreeBoard";

// 테스트용
import Test from "./pages/test";
import Test2 from "./pages/Test2";

// 임시 사용
import ExecStatsPage from "./pages/exercises/ExecStatsPage";
import CalendarPage from "./pages/exercises/calendar/CalendarPage";
import StatsPage from "./pages/exercises/StatsPage";

// 유진
import ManagementPage from "./pages/admin/ManagementPage";

//라우트
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <Router>
      <div>
        {/* <Header /> */}
        <Routes>
          {/* 공용 컴포넌트 :: 회원, 비회원 모두 접근 가능 */}
          <Route element={<MainLayout />}>
            <Route path="/prepare" element={<PreparingPage />} />{" "}
            {/* 준비 중인 페이지 */}
            <Route path="/notice" element={<NoticePage />} /> {/* 공지사항 */}
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Route>

          {/* PublicRoute: 토큰이 없는 사용자만 접근 가능 (로그인 X) */}
          <Route element={<PublicRoute />}>
            <Route element={<MainLayout />}>
              {/* SNS 로그인 */}
              <Route
                path="/oauth/callback/kakao"
                element={<KakaoRedirectHandler />}
              />

              {/* 비회원 */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/intro" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/join" element={<JoinPage />} />
            </Route>
          </Route>

          {/* PrivateRoute: 토큰을 가진 사용자만 접근 가능 (로그인 O) */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              {/* JWT 로그아웃 테스트용 */}
              <Route path="/logout" element={<Logout />} />

              {/* 회원 */}
              <Route path="/main" element={<LoginMain />} />
              <Route path="/mainpage" element={<LoginMain />} />
              <Route path="/user/info" element={<EditMyInfo />} />
              <Route path="/user/editpwd" element={<EditPwd />} />

              {/* 운동 */}
              <Route path="/squat/setting" element={<SquatSetting />} />
              {/* <Route path="/exec/squat" element={<SquatExec />} /> */}

              <Route path="/exec/result" element={<SquatResult />} />
              <Route path="/exec/rest" element={<RestTimerPage />} />

              {/* 유진 */}
              <Route path="/admin/management" element={<ManagementPage />} />
            </Route>
          </Route>

          {/* 공통 Header를 포함하지 않는 컴포넌트 :: 로그인 사용자만 접근 가능 */}
          <Route element={<PrivateRoute />}>
            {/* 운동 */}
            <Route path="/exec/squat" element={<SquatExec />} />

            {/* 커뮤니티 */}
            {/* <Route path="/community/main" element={<ViewPostsAll />} /> */}
            <Route path="/community/*" element={<CommunityRoutes />} />
          </Route>

          {/* 테스트용 */}
          <Route path="/test" element={<Test />} />
          <Route path="/test2" element={<Test2 />} />

          {/* 임시 사용 */}
          <Route path="/stats" element={<ExecStatsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function CommunityRoutes() {
  return (
    // /community 경로에 대한 중첩 라우트
    <Routes>
      {/* 커뮤니티 공통 레이아웃을 포함하는 컴포넌트 */}
      <Route element={<CommunityLayout />}>
        <Route path="/main" element={<PostsAll />} />
        <Route path="/posts-all" element={<PostsAll />} />
        <Route path="/fotd" element={<CategoryFotd />} />
        <Route path="/feedback" element={<CategoryFeedback />} />
        <Route path="/qna" element={<CategoryQnA />} />
        <Route path="/freeboard" element={<CategoryFreeBoard />} />
      </Route>
      {/* <Route path=":postId" element={<ViewPostDetails />} /> */}
    </Routes>
  );
}

export default App;
