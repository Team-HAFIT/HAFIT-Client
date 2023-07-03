import React from "react";
import { Layout } from 'antd';

const { Footer } = Layout;

function MyFooter() {
  return (
    <Footer style={{ textAlign: 'center' }}>
      <p style={{ color: "#999999" }}>© 2023 HAFIT. All rights reserved.</p>
    </Footer>
  );
}

export default MyFooter;
