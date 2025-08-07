import React from "react";
import SideNav from "./(adminpages)/SideNav";
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
        <SideNav />
      <div className="flex-1 min-h-screen">{children}</div>
    </div>
  );
};

export default layout;
