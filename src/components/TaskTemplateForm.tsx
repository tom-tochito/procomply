import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

// Props definition
interface TaskTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: TaskTemplateData) => void;
  editData?: TaskTemplateData; // Optional template data to pre-fill for editing
}

// Define a type for the template data
interface TaskTemplateData {
  code: string;
  name: string;
  taskCategory: string;
  type: string;
  instruction: string;
  observation: string;
  riskArea: string;
  subsection: string;
  priority: string;
  riskLevel: string;
  statutory: string; // "Yes" or "No"
  repeatValue: string; // Should be number, but form state is string
  repeatUnit: string;
  amberValue: string; // Should be number, but form state is string
  amberUnit: string;
}

export default function TaskTemplateForm({
  isOpen,
  onClose,
  onSave,
  editData,
}: TaskTemplateFormProps) {
  // Form state for all fields in the modal
  const [code, setCode] = useState(editData?.code || "");
  const [name, setName] = useState(editData?.name || "");
  const [taskCategory, setTaskCategory] = useState(
    editData?.taskCategory || ""
  );
  const [type, setType] = useState(editData?.type || "");
  const [instruction, setInstruction] = useState(editData?.instruction || "");
  const [observation, setObservation] = useState(editData?.observation || "");
  const [riskArea, setRiskArea] = useState(editData?.riskArea || "");
  const [subsection, setSubsection] = useState(editData?.subsection || "");
  const [priority, setPriority] = useState(editData?.priority || "");
  const [riskLevel, setRiskLevel] = useState(editData?.riskLevel || "");
  const [isStatutory, setIsStatutory] = useState(
    editData?.statutory === "Yes" || false
  );
  const [repeatValue, setRepeatValue] = useState(editData?.repeatValue || "");
  const [repeatUnit, setRepeatUnit] = useState(editData?.repeatUnit || "");
  const [amberValue, setAmberValue] = useState(editData?.amberValue || "");
  const [amberUnit, setAmberUnit] = useState(editData?.amberUnit || "");

  // Field options
  const categoryOptions = ["Category 1", "Category 2", "Category 3"];
  const typeOptions = ["Type 1", "Type 2", "Type 3"];
  const riskAreaOptions = [
    "Asbestos",
    "Fire",
    "Health & Safety",
    "Legionella",
    "Electrical",
  ];
  const subsectionOptions = [
    "Inspection",
    "Fire Doors",
    "Fire Hazards",
    "Label",
    "Fire Alarm System",
  ];
  const priorityOptions = ["High", "Medium", "Low"];
  const riskLevelOptions = ["High", "Medium", "Low"];
  const unitOptions = ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"];

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      code,
      name,
      taskCategory,
      type,
      instruction,
      observation,
      riskArea,
      subsection,
      priority,
      riskLevel,
      statutory: isStatutory ? "Yes" : "No",
      repeatValue,
      repeatUnit,
      amberValue,
      amberUnit,
    });
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <div className="px-4 py-3 border-b border-gray-200">
                  <Dialog.Title className="text-base font-medium text-gray-900">
                    {editData ? "Edit Task Template" : "New Task Template"}
                  </Dialog.Title>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code*:
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        placeholder="TT-000000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name*:
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Category:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={taskCategory}
                        onChange={(e) => setTaskCategory(e.target.value)}
                      >
                        <option value="">-</option>
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">-</option>
                        {typeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observation:
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instruction*:
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Risk Area*:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={riskArea}
                        onChange={(e) => setRiskArea(e.target.value)}
                        required
                      >
                        <option value="">-</option>
                        {riskAreaOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subsection:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={subsection}
                        onChange={(e) => setSubsection(e.target.value)}
                      >
                        <option value="">-</option>
                        {subsectionOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority*:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        required
                      >
                        <option value="">-</option>
                        {priorityOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Risk Level*:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(e.target.value)}
                        required
                      >
                        <option value="">-</option>
                        {riskLevelOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={isStatutory}
                          onChange={(e) => setIsStatutory(e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Statutory
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Repeat Value:
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={repeatValue}
                          onChange={(e) => setRepeatValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Repeat Unit:
                        </label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={repeatUnit}
                          onChange={(e) => setRepeatUnit(e.target.value)}
                        >
                          <option value="">-</option>
                          {unitOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amber Value:
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={amberValue}
                          onChange={(e) => setAmberValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amber Unit:
                        </label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={amberUnit}
                          onChange={(e) => setAmberUnit(e.target.value)}
                        >
                          <option value="">-</option>
                          {unitOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
