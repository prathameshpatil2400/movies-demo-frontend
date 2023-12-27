import MainLayout from "@/components/mainLayout";
import MovieList from "@/screens/MovieList";
import React from "react";

const page = () => {
  return (
    <MainLayout>
      <MovieList />
    </MainLayout>
  );
};

export default page;
