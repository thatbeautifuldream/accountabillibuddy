import { Metadata } from "next";
import HomeClient from "./page-client";

export const metadata: Metadata = {
  title: "Accountabillibuddy",
  description: "Your accountability buddy",
};

export default function Home() {
  return (
    <>
      <HomeClient />
    </>
  );
}
