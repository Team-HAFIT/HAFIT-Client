import { Outlet, Navigate } from "react-router";
import { useLocation } from "react-router-dom";

import { CheckToken } from "../auth/CheckTokenl";
import { Spin } from "antd";

export default function PrivateRoute() {
  const location = useLocation();
  const { isAuth } = CheckToken(location.key);

  if (isAuth === "Failed") {
    return <Navigate to="/login" state={{ from: location }} />;
  } else if (isAuth === "Loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          background: "rgba(0, 0, 0, 0.05)",
          height: "calc(100vh - 50px)",
        }}
      >
        <Spin style={{ paddingBottom: "96px" }} />
      </div>
    );
  }

  return <Outlet />;
}
