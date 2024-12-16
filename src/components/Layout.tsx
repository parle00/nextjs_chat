import React, { ReactNode } from "react";
interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <main style={{ padding: "20px" }}>{children}</main>
    </>
  );
};

export default Layout;
