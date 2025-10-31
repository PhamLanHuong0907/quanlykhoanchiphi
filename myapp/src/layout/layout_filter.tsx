import React from "react";
import Navbar from "../components/navbar";
import "./layout_filter.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      {/* Navbar cá»‘ Ä‘á»‹nh trÃªn Ä‘áº§u */}
      <Navbar />
      {/* Khu vá»±c ná»™i dung cho tá»«ng trang */}
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
