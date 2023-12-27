"use client";
import { useEffect, useState } from "react";
import Login from "@/screens/Login";
import MainLayout from "@/components/mainLayout";
import MovieList from "@/screens/MovieList";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      router.push("/movie-list");
    } else {
      router.push("/login");
    }
  }, [router]);
}
