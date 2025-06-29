import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FormField {
  id: string;
  type:
    | "text"
    | "textarea"
    | "dropdown"
    | "checkbox"
    | "radio"
    | "date"
    | "number"
    | "email"
    | "phone";
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  options?: string[]; // for dropdown/radio
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    patternMessage?: string;
  };
  step?: number; // for multi-step forms
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  steps: number;
  isMultiStep: boolean;
  createdAt: string;
  isPublished: boolean;
}
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  steps: number;
}

const defaultTemplates: FormTemplate[] = [
  {
    id: "contact-us",
    name: "Contact Us",
    description: "Basic contact form with name, email, and message",
    steps: 1,
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
        step: 1,
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email",
        required: true,
        step: 1,
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Tell us how we can help",
        required: true,
        step: 1,
      },
    ],
  },
  {
    id: "job-application",
    name: "Job Application",
    description: "Multi-step job application form",
    steps: 3,
    fields: [
      {
        id: "firstName",
        type: "text",
        label: "First Name",
        required: true,
        step: 1,
      },
      {
        id: "lastName",
        type: "text",
        label: "Last Name",
        required: true,
        step: 1,
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        required: true,
        step: 1,
      },
      {
        id: "experience",
        type: "dropdown",
        label: "Years of Experience",
        required: true,
        options: ["0-1 years", "2-5 years", "5+ years"],
        step: 2,
      },
      {
        id: "skills",
        type: "checkbox",
        label: "Skills",
        options: ["JavaScript", "React", "Node.js", "Python"],
        step: 2,
        required: false,
      },
      {
        id: "coverLetter",
        type: "textarea",
        label: "Cover Letter",
        placeholder: "Tell us why you're interested...",
        step: 3,
        required: false,
      },
    ],
  },
];

interface FormStore {
  // Current form being built
  currentForm: FormData;
  selectedField: string | null;
  currentStep: number;
  templates: FormTemplate[];
  savedForms: FormData[];

  // Actions
  setCurrentForm: (form: Partial<FormData>) => void;
  addField: (field: FormField) => void;
  removeField: (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  setSelectedField: (id: string | null) => void;
  setCurrentStep: (step: number) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  addStep: () => void;
  removeStep: (stepNumber: number) => void;
  moveFieldToStep: (fieldId: string, step: number) => void;
  loadTemplate: (template: FormTemplate) => void;
  saveAsTemplate: (name: string, description: string, id?: string) => void;
  saveForm: () => void;
  loadForm: (id: string) => FormData | null;
  publishForm: () => string; // returns shareable ID
  createNewForm: () => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
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
      templates: defaultTemplates,
      savedForms: [],

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
          selectedField:
            state.selectedField === id ? null : state.selectedField,
        })),

      reorderFields: (fromIndex, toIndex) =>
        set((state) => {
          const fields = [...state.currentForm.fields];
          const [removed] = fields.splice(fromIndex, 1);
          fields.splice(toIndex, 0, removed);
          return {
            currentForm: {
              ...state.currentForm,
              fields,
            },
          };
        }),

      updateField: (id, updates) =>
        set((state) => ({
          currentForm: {
            ...state.currentForm,
            fields: state.currentForm.fields.map((field) =>
              field.id === id ? { ...field, ...updates } : field
            ),
          },
        })),

      setSelectedField: (id) => set({ selectedField: id }),
      setCurrentStep: (step) => set({ currentStep: step }),
      addStep: () =>
        set((state) => ({
          currentForm: {
            ...state.currentForm,
            steps: state.currentForm.steps + 1,
            isMultiStep: true,
          },
        })),

      removeStep: (stepNumber) =>
        set((state) => {
          const fields = state.currentForm.fields
            .map((field) =>
              field.step && field.step > stepNumber
                ? { ...field, step: field.step - 1 }
                : field
            )
            .filter((field) => field.step !== stepNumber);

          return {
            currentForm: {
              ...state.currentForm,
              fields,
              steps: Math.max(1, state.currentForm.steps - 1),
              isMultiStep: state.currentForm.steps - 1 > 1,
            },
          };
        }),

      moveFieldToStep: (fieldId, step) =>
        set((state) => ({
          currentForm: {
            ...state.currentForm,
            fields: state.currentForm.fields.map((field) =>
              field.id === fieldId ? { ...field, step } : field
            ),
          },
        })),

      loadTemplate: (template) =>
        set((state) => ({
          currentForm: {
            ...state.currentForm,
            id: template.id,
            title: template.name,
            description: template.description,
            fields: template.fields,
            steps: template.steps,
            isMultiStep: template.steps > 1,
          },
        })),

      saveAsTemplate: (name, description, id) => {
        if (id) {
          console.log(id);

          const state = get();
          const template = state.templates.find(
            (template) => template.id == id
          );

          if (template) {
            Object.assign(template, {
              id: id,
              name,
              description,
              fields: state.currentForm.fields,
              steps: state.currentForm.steps,
            });
          }
        } else {
          set((state) => {
            const newTemplate: FormTemplate = {
              id: Date.now().toString(),
              name,
              description,
              fields: state.currentForm.fields,
              steps: state.currentForm.steps,
            };
            return {
              templates: [...state.templates, newTemplate],
            };
          });
        }
      },

      saveForm: () =>
        set((state) => {
          const formId = state.currentForm.id || Date.now().toString();
          const updatedForm = {
            ...state.currentForm,
            id: formId,
          };

          const existingIndex = state.savedForms.findIndex(
            (f) => f.id === formId
          );
          const savedForms =
            existingIndex >= 0
              ? state.savedForms.map((f, i) =>
                  i === existingIndex ? updatedForm : f
                )
              : [...state.savedForms, updatedForm];

          return {
            currentForm: updatedForm,
            savedForms,
          };
        }),

      loadForm: (id) => {
        const form = get().savedForms.find((f) => f.id === id);
        if (form) {
          set({ currentForm: form });
          return form;
        }
        return null;
      },

      publishForm: () => {
        const state = get();
        const formId = state.currentForm.id || Date.now().toString();
        const publishedForm = {
          ...state.currentForm,
          id: formId,
          isPublished: true,
        };

        set((state) => ({
          currentForm: publishedForm,
          savedForms: state.savedForms.map((f) =>
            f.id === formId ? publishedForm : f
          ),
        }));

        return formId;
      },

      createNewForm: () =>
        set({
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
        }),
    }),
    {
      name: "form-builder-storage",
    }
  )
);
