import { Plus, Minus, ChevronLeft, ChevronRight, Layers } from "lucide-react"
import { FormField, useFormStore } from "~/store/form-store"

export function MultiStepControls() {
  const { currentForm, currentStep, setCurrentStep, addStep, removeStep, setCurrentForm } = useFormStore()

  const handleToggleMultiStep = (enabled: boolean) => {
    if (enabled) {
      setCurrentForm({
        isMultiStep: true,
        steps: Math.max(currentForm.steps, 1),
      })
      const fieldsWithSteps = currentForm.fields.map((field) => ({
        ...field,
        step: field.step || 1,
      }))
      setCurrentForm({ fields: fieldsWithSteps })
    } else {
      setCurrentForm({
        isMultiStep: false,
        steps: 1,
      })
      const fieldsWithoutSteps = currentForm.fields.map((field: FormField) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { step, ...fieldWithoutStep } = field
        return fieldWithoutStep
      })
      setCurrentForm({ fields: fieldsWithoutSteps })
      setCurrentStep(1)
    }
  }

  const fieldsInCurrentStep = currentForm.fields.filter((field) => field.step === currentStep).length

  return (
    <div className="bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-purple-100/50 rounded-lg">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg p-4">
        <div className="flex items-center text-lg">
          <Layers className="w-5 h-5 mr-2" />
          Multi-Step Form
        </div>
        <p className="text-indigo-100 text-sm">Create step-by-step experiences</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
          <div>
            <label htmlFor="multi-step" className="text-sm font-semibold text-gray-700">Enable Multi-Step</label>
            <p className="text-xs text-gray-600">Break your form into multiple steps</p>
          </div>
          <label htmlFor="required" className='flex cursor-pointer select-none items-center'>
            <span className="sr-only">Multi Step Form</span>
            <div className='relative'>
              <input
                id='required'
                type='checkbox'
                checked={currentForm.isMultiStep}
                onChange={(event) => handleToggleMultiStep(event.target.checked)}
                className="hidden"
              />
              <div
                className={`box block h-7 w-12 rounded-full ${
                  currentForm.isMultiStep ? 'bg-indigo-500' : 'bg-gray-200'
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white transition ${
                  currentForm.isMultiStep ? 'translate-x-full' : ''
                }`}
              ></div>
            </div>
          </label>
        </div>

        {currentForm.isMultiStep && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Total Steps</span>
                  <p className="text-xs text-gray-600">
                    {currentForm.steps} step{currentForm.steps > 1 ? "s" : ""} in your form
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={addStep}
                    className="border-2 border-green-200 hover:bg-green-50 hover:border-green-300 bg-transparent"
                  >
                    <Plus className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => removeStep(currentForm.steps)}
                    disabled={currentForm.steps <= 1}
                    className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="current-step" className="text-sm font-semibold text-gray-700">Current Step</label>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-gray-200">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={currentStep <= 1}
                    className="border-2 hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">
                      {currentStep} / {currentForm.steps}
                    </div>
                    <p className="text-xs text-gray-600">
                      {fieldsInCurrentStep} field{fieldsInCurrentStep !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={currentStep >= currentForm.steps}
                    className="border-2 hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step Progress Indicator */}
              <div className="space-y-3">
                <label htmlFor="progress" className="text-sm font-semibold text-gray-700">Progress Visualization</label>
                <div className="flex space-x-1">
                  {Array.from({ length: currentForm.steps }, (_, i) => (
                    <div
                      key={i}
                      className={`h-3 flex-1 rounded-full transition-all duration-300 ${
                        i + 1 === currentStep
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
                          : i + 1 < currentStep
                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                            : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Start</span>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
