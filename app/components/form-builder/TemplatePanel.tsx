// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useFormStore, FormData } from "~/store/form-store"
import { Save, FileText, LayoutTemplateIcon as Template, Plus, Folder } from "lucide-react"
// import { useState } from "react"

export function TemplatePanel() {
  const { templates, savedForms, loadTemplate, currentForm, saveAsTemplate, loadForm, saveForm, createNewForm } =
    useFormStore()

  const handleSaveTemplate = () => {
    console.log(currentForm.id)
    saveAsTemplate(currentForm.title, currentForm.description, currentForm.id || '')
  }

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    console.log(templateId, 'templateId')
    if (template) {
      loadTemplate(template)
    }
  }

  const handleLoadForm = (formId: string) => {
    loadForm(formId)
  }

  const handleSaveCurrentForm = () => {
    saveForm()
  }

  const handleNewForm = () => {
    createNewForm()
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-purple-100/50 rounded-lg max-w-xs">
      <div className="bg-gradient-to-r from-emerald-400 to-teal-600 text-white rounded-t-lg p-4">
        <div className="flex items-center text-lg">
          <Template className="w-5 h-5 mr-2" />
          Templates & Forms
        </div>
        <p className="text-emerald-100 text-sm">Manage your form library</p>
      </div>
      <div className="p-6 space-y-6">
        {/* Form Management */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-700 flex items-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
            Quick Actions
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleNewForm}
              className="border-2 border-blue-200 hover:bg-blue-50 rounded-lg bg-transparent flex items-center py-1 justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
            <button
              onClick={handleSaveCurrentForm}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 py-1 rounded-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>

        {/* Saved Forms */}
        {savedForms.length > 0 && (
          <div className="space-y-3">
            <label htmlFor="saved-forms" className="text-sm font-semibold text-gray-700 flex items-center">
              <Folder className="w-4 h-4 mr-2" />
              Saved Forms
            </label>
            <select className="border-2 border-gray-300 w-full p-1 rounded-lg outline-teal-400 text-sm" id="saved-forms" onChange={(event) => handleLoadForm(event.target.value)}>
              {savedForms.map((form: FormData) => (
                <option key={form.id} value={form.id}>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="truncate">{form.title}</span>
                    {form.isPublished && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Published
                      </span>
                    )}
                  </div>
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Templates */}
        <div className="space-y-3">
          <label htmlFor="templates" className="text-sm font-semibold text-gray-700 flex items-center">
            <Template className="w-4 h-4 mr-2" />
            Templates
          </label>
          <select className="border-2 border-gray-300 w-full p-1 rounded-lg outline-teal-400 text-sm" id="templates" onChange={(e) => handleLoadTemplate(e.target.value)}>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                <div>
                  <div className="font-medium">{template.name}</div>
                </div>
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 bg-transparent py-1 rounded-lg flex items-center justify-center gap-2"
          onClick={handleSaveTemplate}
        >
          <Template className="w-4 h-4 mr-2" />
              Save as Template
        </button>

      </div>
    </div>
  )
}
