import { useFormStore, type FormField } from "~/store/form-store"
import { Sparkles } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { useEffect, useState } from "react"
import FieldRenderer from "./FieldRenderer"


export function FormCanvas() {
  const { currentForm, selectedField, setSelectedField, removeField, reorderFields, currentStep } =
    useFormStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    reorderFields(sourceIndex, destinationIndex)
  }

  const fieldsToShow = currentForm.isMultiStep
    ? currentForm.fields.filter((field: FormField) => field.step === currentStep)
    : currentForm.fields

  return (
    <div className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-purple-100/50 rounded-xl grow">
      <div className="rounded-t-xl border-b border-purple-100">
        <div className="space-y-3 flex flex-col p-3 rounded-t-xl">
          <input
            value={currentForm.title}
            onChange={(e: { target: { value: string } }) => useFormStore.getState().setCurrentForm({ title: e.target.value })}
            className="text-2xl outline-0 font-bold border-none p-0 focus-visible:ring-0 bg-transparent placeholder-purple-200 text-purple-300"
          />
          <textarea
            value={currentForm.description}
            onChange={(e: { target: { value: string } }) => useFormStore.getState().setCurrentForm({ description: e.target.value })}
            className="border-none outline-0 p-0 focus-visible:ring-0 resize-none bg-transparent text-gray-400 placeholder-gray-400"
            placeholder="Add a compelling description to engage your users..."
            rows={2}
          />
        </div>
      </div>
      <div className="p-8">
        {fieldsToShow.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Building Your Form</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Click on field types from the Field Library to add them to your form. You can then drag to reorder and
                customize each field.
              </p>
            </div>
          </div>
        ) : (
          mounted && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-6 min-h-[100px] transition-all duration-300 rounded-xl p-4 ${
                      snapshot.isDraggingOver
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-dashed border-purple-300"
                        : ""
                    }`}
                  >
                    {fieldsToShow.map((field: FormField, index: number) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <FieldRenderer
                              field={field}
                              isSelected={selectedField === field.id}
                              onSelect={() => setSelectedField(field.id)}
                              onDelete={() => removeField(field.id)}
                              onEdit={() => setSelectedField(field.id)}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )
        )}
      </div>
    </div>
  )
}