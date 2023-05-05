import React from "react";

import "../styles/components/footer.css";

function Footer() {
  return (
    <div className="footer">
      {" "}
      <hr style={{ background: "#dbdbdb", height: "1px", border: "0" }} />
      <p style={{ color: "#999999" }}>© 2023 HAFIT. All rights reserved.</p>
    </div>
  );
}

export default Footer;
