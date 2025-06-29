import { FormField, useFormStore } from "~/store/form-store"
import { Plus, X, Settings, Palette } from "lucide-react"
import { useState } from "react"

export function PropertiesPanel() {
  const { currentForm, selectedField, updateField } = useFormStore()
  const [newOption, setNewOption] = useState("")

  const field = currentForm.fields.find((f) => f.id === selectedField)

  if (!field) {
    return (
      <div className="bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-purple-100/50 p-4 rounded-xl max-h-fit max-w-xs">
        <div>
          <div className="flex items-center text-lg">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3">
              <Settings className="w-4 h-4 text-white" />
            </div>
            Properties
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-600 font-medium">Select a field to customize</p>
          <p className="text-sm text-gray-500 mt-1">Click on any field in your form to edit its properties</p>
        </div>
      </div>
    )
  }

  const handleUpdate = (updates: Partial<FormField>) => {
    updateField(field.id, updates)
  }

  const addOption = () => {
    if (newOption.trim() && field.options) {
      handleUpdate({
        options: [...field.options, newOption.trim()],
      })
      setNewOption("")
    }
  }

  const removeOption = (index: number) => {
    if (field.options) {
      handleUpdate({
        options: field.options.filter((_, i) => i !== index),
      })
    }
  }

  const updateOption = (index: number, value: string) => {
    if (field.options) {
      const newOptions = [...field.options]
      newOptions[index] = value
      handleUpdate({ options: newOptions })
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-purple-100/50 max-h-fit rounded-lg max-w-xs min-w-[300px]">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg  p-4">
        <div className="flex items-center text-lg">
          <Settings className="w-5 h-5 mr-2" />
          Field Properties
        </div>
        <p className="text-orange-100 text-sm">Customize your selected field</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="label" className="block text-sm font-semibold text-gray-700">
            Field label
          </label>
          <input
            id="label"
            value={field.label}
            onChange={(e) => handleUpdate({ label: e.target.value })}
            className="w-full outline-orange-300 border-2 p-2 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="placeholder" className="block text-sm font-semibold text-gray-700">
            Placeholder Text
          </label>
          <input
            id="placeholder"
            value={field.placeholder || ""}
            onChange={(e) => handleUpdate({ placeholder: e.target.value })}
            className="w-full text-sm outline-orange-300 border-2 p-2 rounded-lg gray"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="helpText" className="block text-sm font-semibold text-gray-700">
            Help Text
          </label>
          <textarea
            id="helpText"
            value={field.helpText || ""}
            onChange={(e) => handleUpdate({ helpText: e.target.value })}
            rows={2}
            className="w-full outline-orange-300 border-2 p-2 rounded-lg"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-200">
          <div>
            <p className="text-sm font-semibold text-gray-700">Required Field</p>
            <p className="text-xs text-gray-600">Users must fill this field</p>
          </div>
          <label htmlFor="required" className='flex cursor-pointer select-none items-center'>
            <span className="sr-only">Required</span>
            <div className='relative'>
              <input
                id='required'
                type='checkbox'
                checked={field.required}
                onChange={(event) => handleUpdate({ required: event.target.checked })}
                className="hidden"
              />
              <div
                className={`box block h-7 w-12 rounded-full ${
                  field.required ? 'bg-orange-400' : 'bg-gray-200'
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white transition ${
                  field.required ? 'translate-x-full' : ''
                }`}
              ></div>
            </div>
          </label>
        </div>

        {currentForm.isMultiStep && (
          <div className="space-y-2">
            <label htmlFor="step-select">Form Step</label>
            <select
              id="step-select"
              value={field.step?.toString() || "1"}
              onChange={(event) => handleUpdate({ step: Number.parseInt(event.target.value, 10) })}
              style={{ border: '2px solid #e5e7eb' }}
            >
              {Array.from({ length: currentForm.steps }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>
                    Step {i + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        {(field.type === "dropdown" || field.type === "radio" || field.type === "checkbox") && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">Options</p>
            <div className="space-y-3">
              {field.options?.map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="w-full border-2 outline-orange-400 rounded-lg p-1 text-sm"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300 p-2 rounded-md"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  placeholder="Add new option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && addOption()}
                  className="w-full border-2 outline-orange-400 rounded-lg p-1 text-sm"
                />
                <button
                  onClick={addOption}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 p-3 rounded-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Validation Settings */}
        <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
          <div className="text-sm font-semibold text-gray-700 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Validation Rules
          </div>

          {(field.type === "text" || field.type === "textarea") && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="minLength" className="text-xs text-gray-600">
                  Min Length
                </label>
                <input
                  id="minLength"
                  type="number"
                  value={field.validation?.minLength || ""}
                  onChange={(e) =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        minLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="border-2 focus:border-blue-200 outline-0 w-24 rounded-lg p-1 text-sm"
                />
              </div>
              <div>
                <label htmlFor="maxLength" className="text-xs text-gray-600">
                  Max Length
                </label>
                <input
                  id="maxLength"
                  type="number"
                  value={field.validation?.maxLength || ""}
                  onChange={(e) =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        maxLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="border-2 focus:border-blue-200 outline-0 w-24 rounded-lg p-1 text-sm"
                />
              </div>
            </div>
          )}

          {field.type === "text" && (
            <div className="space-y-3">
              <div>
                <label htmlFor="pattern" className="text-xs text-gray-600">
                  Pattern (RegEx)
                </label>
                <input
                  id="pattern"
                  value={field.validation?.pattern || ""}
                  onChange={(e) =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        pattern: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., ^[A-Za-z]+$"
                  className="border-2 focus:border-blue-200 outline-0 w-full rounded-lg p-1 text-sm"

                />
              </div>
              <div>
                <label htmlFor="patternMessage" className="text-xs text-gray-600">
                  Error Message
                </label>
                <input
                  id="patternMessage"
                  value={field.validation?.patternMessage || ""}
                  onChange={(e) =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        patternMessage: e.target.value,
                      },
                    })
                  }
                  placeholder="Please enter a valid value"
                  className="border-2 focus:border-blue-200 outline-0 w-full rounded-lg p-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}