import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface FormField {
  id: string
  type: "text" | "textarea" | "dropdown" | "checkbox" | "radio" | "date" | "number" | "email" | "phone"
  label: string
  placeholder?: string
  required: boolean
  helpText?: string
  options?: string[] // for dropdown/radio
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    patternMessage?: string
  }
  step?: number // for multi-step forms
}

export interface FormData {
  id: string
  title: string
  description: string
  fields: FormField[]
  steps: number
  isMultiStep: boolean
  createdAt: string
  isPublished: boolean
}

interface FormStore {
  currentForm: FormData
  selectedField: string | null

  // Actions
  addField: (field: FormField) => void
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      currentForm: {
        id: "",
        title: "Untitled Form",
        description: "",
        fields: [],
        steps: 1,
        isMultiStep: false,
        createdAt: new Date().toISOString(),
        isPublished: false,
      },
      selectedField: null,
      currentStep: 1,

      addField: (field) =>
        set((state) => ({
          currentForm: {
            ...state.currentForm,
            fields: [...state.currentForm.fields, field],
          },
        })),
    }),
    {
      name: "form-builder-storage",
    },
  ),
)
