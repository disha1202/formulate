import { AlignLeft, Calendar, CheckSquare, ChevronDown, Circle, Hash, Mail, Phone, Plus, Sparkles, Type } from "lucide-react";
import { FormField, useFormStore } from "~/store/form-store";

const fieldTypes = [
  { type: "text", label: "Text Input", icon: Type, color: "from-blue-500 to-cyan-500" },
  { type: "textarea", label: "Textarea", icon: AlignLeft, color: "from-green-500 to-emerald-500" },
  { type: "dropdown", label: "Dropdown", icon: ChevronDown, color: "from-purple-500 to-violet-500" },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare, color: "from-pink-500 to-rose-500" },
  { type: "radio", label: "Radio", icon: Circle, color: "from-orange-500 to-amber-500" },
  { type: "date", label: "Date", icon: Calendar, color: "from-indigo-500 to-blue-500" },
  { type: "number", label: "Number", icon: Hash, color: "from-teal-500 to-cyan-500" },
  { type: "email", label: "Email", icon: Mail, color: "from-red-500 to-pink-500" },
  { type: "phone", label: "Phone", icon: Phone, color: "from-yellow-500 to-orange-500" },
]

export function FieldPalette() {
  const { addField, currentForm, currentStep } = useFormStore()

  const handleAddField = (type: FormField["type"]) => {
    const fieldCount = currentForm.fields.filter((f) => f.type === type).length
    const newField: FormField = {
      id: `${type}_${Date.now()}`,
      type,
      label: `${fieldTypes.find((f) => f.type === type)?.label} ${fieldCount + 1}`,
      placeholder: type === "textarea" ? "Enter your message..." : "Enter value...",
      required: false,
      step: currentForm.isMultiStep ? currentStep : undefined,
      options: type === "dropdown" || type === "radio" || type === "checkbox" ? ["Option 1", "Option 2"] : undefined,
    }

    addField(newField)
  }

  return (
    <div className="bg-white/70 p-6 rounded-xl backdrop-blur-sm border-0 shadow-xl shadow-purple-100/50 min-w-64 max-h-fit">
      <div className="pb-4">
        <div className="flex items-center text-lg">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          Field Library
        </div>
        <p className="text-sm text-gray-600 pt-1">Drag or click to add fields</p>
      </div>
      <div className="space-y-3 flex flex-col">
        {fieldTypes.map((field) => {
          const Icon = field.icon
          return (
            <button
              key={field.type}
              className="justify-start h-12 outline-0 hover:shadow-lg transition-all duration-200 group relative overflow-hidden bg-transparent rounded-xl border border-gray-200"
              onClick={() => handleAddField(field.type as FormField["type"])}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${field.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              />
              <div className="w-full flex items-center py-2 px-3">
                <div
                  className={`p-1.5 bg-gradient-to-r ${field.color} rounded-md mr-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{field.label}</span>
                <Plus className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
            </button>
          )
        })}
      </div>
    </div>
  )
}