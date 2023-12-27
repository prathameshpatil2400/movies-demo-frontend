import React from "react";
import CreateMovie from "@/screens/CreateMovie";
import MainLayout from "@/components/mainLayout";

const page = () => {
  return (
    <MainLayout>
      <CreateMovie />
    </MainLayout>
  );
};

export default page;
