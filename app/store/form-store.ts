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
  // Current form being built
  currentForm: FormData
  selectedField: string | null
  currentStep: number

  // Actions
  setCurrentForm: (form: Partial<FormData>) => void
  addField: (field: FormField) => void
  removeField: (id: string) => void
  reorderFields: (fromIndex: number, toIndex: number) => void
  setSelectedField: (id: string | null) => void
  setCurrentStep: (step: number) => void
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
      currentStep: 1,
      selectedField: null,

      setCurrentForm: (form) =>
        set((state) => ({
          currentForm: { ...state.currentForm, ...form },
        })),

      addField: (field) =>
        set((state) => ({
          currentForm: {
            ...state.currentForm,
            fields: [...state.currentForm.fields, field],
          },
        })),

      removeField: (id) =>
        set((state) => ({
          currentForm: {
            ...state.currentForm,
            fields: state.currentForm.fields.filter((field) => field.id !== id),
          },
          selectedField: state.selectedField === id ? null : state.selectedField,
        })),

      reorderFields: (fromIndex, toIndex) =>
        set((state) => {
          const fields = [...state.currentForm.fields]
          const [removed] = fields.splice(fromIndex, 1)
          fields.splice(toIndex, 0, removed)
          return {
            currentForm: {
              ...state.currentForm,
              fields,
            },
          }
        }),

      setSelectedField: (id) => set({ selectedField: id }),
      setCurrentStep: (step) => set({ currentStep: step }),


    }),
    {
      name: "form-builder-storage",
    },
  ),
)
