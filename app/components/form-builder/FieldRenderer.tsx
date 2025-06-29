import { GripVertical, Settings, Trash2 } from "lucide-react"
import { FormField } from "~/store/form-store"

interface FieldRendererProps {
  field: FormField
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onEdit: () => void
  isDragging?: boolean
}

function FieldRenderer({ field, isSelected, onSelect, onDelete, onEdit, isDragging }: FieldRendererProps) {
  const renderFieldComponent = () => {
    const baseClasses = "w-full p-2"

    switch (field.type) {
    case "text":
    case "email":
    case "phone":
    case "number":
      return (
        <input
          placeholder={field.placeholder}
          type={
            field.type === "number"
              ? "number"
              : field.type === "email"
                ? "email"
                : field.type === "phone"
                  ? "tel"
                  : "text"
          }
          className={`${baseClasses} bg-white/80 border border-gray-200 rounded-lg`}
          disabled
        />
      )
    case "textarea":
      return <textarea placeholder={field.placeholder} className={`${baseClasses} bg-white/80 border border-gray-200 rounded-lg`} disabled />
    case "dropdown":
      return (
        <select className={`${baseClasses} px-3 py-2 border border-input bg-background rounded-md`} disabled>
          <option>{field.placeholder || "Select an option"}</option>
          {field.options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    case "checkbox":
      return (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input type="checkbox" disabled className="rounded" />
              <label className="text-sm">{option}</label>
            </div>
          ))}
        </div>
      )
    case "radio":
      return (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input type="radio" name={field.id} disabled />
              <label className="text-sm">{option}</label>
            </div>
          ))}
        </div>
      )
    case "date":
      return <input type="date" className={baseClasses} disabled />
    default:
      return <input placeholder={field.placeholder} className={baseClasses} disabled />
    }
  }

  return (
    <div
      className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${
        isSelected
          ? "border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg shadow-purple-100"
          : "border-gray-200 hover:border-purple-300 hover:shadow-md bg-white/80 backdrop-blur-sm"
      } ${isDragging ? "opacity-70 rotate-1 shadow-2xl scale-105" : ""}`}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-gray-100 transition-colors">
            <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-800">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.helpText && <p className="text-xs text-gray-500 mb-2">{field.helpText}</p>}
          </div>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 hover:bg-purple-100 hover:text-purple-600 rounded-lg"
            onClick={(e: { stopPropagation: () => void }) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {renderFieldComponent()}
    </div>
  )
}

export default FieldRenderer