import type { MetaFunction } from "@remix-run/node";
import { FieldPalette } from "~/components/form-builder/FieldPalette";
import { FormCanvas } from "~/components/form-builder/FormCanvas";
import { MultiStepControls } from "~/components/form-builder/MultiStepControls";
import { PropertiesPanel } from "~/components/form-builder/PropertiesPanel";
import { TemplatePanel } from "~/components/form-builder/TemplatePanel";
import Header from "~/components/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "Formulate" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <Header />

      <div className="container mx-auto py-6 flex gap-3">
        <div className="space-y-4">
           <FieldPalette />
          <MultiStepControls />
        </div>
        
       

        <FormCanvas />

        <div className="space-y-4">
          <PropertiesPanel />
          <TemplatePanel />
        </div>
        
      </div>
    </div>
  );
}