import type { MetaFunction } from "@remix-run/node";
import { Sparkles } from "lucide-react";
import { FieldPalette } from "~/components/form-builder/FieldPalette";
import Header from "~/components/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "Formulate" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <Header />

      <div className="container mx-auto p-6">
        <FieldPalette />
      </div>
    </div>
  );
}