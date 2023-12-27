'use client'
import MainLayout from "@/components/mainLayout";
import CreateMovie from "@/screens/CreateMovie";
import React from "react";

const page = () => {

  return (
    <MainLayout>
      <CreateMovie />
    </MainLayout>
  );
};

export default page;
