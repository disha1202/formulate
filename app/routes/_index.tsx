import type { MetaFunction } from "@remix-run/node";
import { Sparkles } from "lucide-react";
import Header from "~/components/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "Formulate" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    // Header
    <Header />
  );
}