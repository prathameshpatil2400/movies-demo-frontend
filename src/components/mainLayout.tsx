import React from "react";

const MainLayout = ({ children }: any) => {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        height: "100%",
        backgroundColor: "#093545",
        color: "#FFF",
        overflow: "auto",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          height: "100%",
        }}
      >
        {children}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          width: "100%",
          height: "111px",
          background: "url('/footer.svg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: "#093545",
        }}
      />
    </div>
  );
};

export default MainLayout;
