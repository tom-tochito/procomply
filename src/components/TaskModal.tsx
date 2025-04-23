import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Props definition
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: any) => void;
  templateData?: any; // Optional template data to pre-fill the form
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  templateData,
}: TaskModalProps) {
  // Form state for all fields in the modal
  const [taskTemplate, setTaskTemplate] = useState(templateData?.code || "");
  const [taskCategory, setTaskCategory] = useState("");
  const [type, setType] = useState("");
  const [instruction, setInstruction] = useState(
    templateData?.instruction || ""
  );
  const [building, setBuilding] = useState("");
  const [associateToSurvey, setAssociateToSurvey] = useState("");
  const [description, setDescription] = useState(
    templateData?.observation || ""
  );
  const [reoccurrences, setReoccurrences] = useState("");
  const [observation, setObservation] = useState("");
  const [inbox, setInbox] = useState("");
  const [riskArea, setRiskArea] = useState(templateData?.riskArea || "");
  const [subsection, setSubsection] = useState(templateData?.subsection || "");
  const [priority, setPriority] = useState(templateData?.priority || "");
  const [riskLevel, setRiskLevel] = useState(templateData?.riskLevel || "");
  const [lastCompleted, setLastCompleted] = useState("");
  const [lastCompletedBy, setLastCompletedBy] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isStatutory, setIsStatutory] = useState(
    templateData?.statutory === "Yes" || false
  );
  const [compliant, setCompliant] = useState("");

  // Field options (would normally come from API)
  const templateOptions = ["Template 1", "Template 2", "Template 3"];
  const categoryOptions = ["Category 1", "Category 2", "Category 3"];
  const typeOptions = ["Type 1", "Type 2", "Type 3"];
  const buildingOptions = ["Building A", "Building B", "Building C"];
  const surveyOptions = ["Survey 1", "Survey 2"];
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
  ];
  const priorityOptions = ["High", "Medium", "Low"];
  const riskLevelOptions = ["High", "Medium", "Low"];
  const compliantOptions = ["Yes", "No", "N/A"];

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      taskTemplate,
      taskCategory,
      type,
      instruction,
      building,
      associateToSurvey,
      description,
      reoccurrences,
      observation,
      inbox,
      riskArea,
      subsection,
      priority,
      riskLevel,
      lastCompleted,
      lastCompletedBy,
      dueDate,
      isStatutory,
      compliant,
    });
  };

  // Render the modal with fields matching the first or second screenshot
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
                    New Task
                  </Dialog.Title>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                  <div className="space-y-4">
                    {/* Fields that appear in the first screenshot */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Template*:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={taskTemplate}
                        onChange={(e) => setTaskTemplate(e.target.value)}
                      >
                        <option value="">-</option>
                        {templateOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Category*:
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
                        Type*:
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
                        Instruction*:
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Building*:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                      >
                        <option value="">-</option>
                        {buildingOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Associate to Survey:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={associateToSurvey}
                        onChange={(e) => setAssociateToSurvey(e.target.value)}
                      >
                        <option value="">Select survey</option>
                        {surveyOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description*:
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reoccurrances*:
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={reoccurrences}
                        onChange={(e) => setReoccurrences(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observation:
                      </label>
                      <div className="relative">
                        <div className="border border-gray-300 rounded-lg p-4 min-h-32">
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="text-sm text-blue-500">
                              Choose a task photo or
                              <br />
                              <span className="text-blue-600 font-semibold">
                                drag it here
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inbox*:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={inbox}
                        onChange={(e) => setInbox(e.target.value)}
                        required
                      >
                        <option value="">Select inbox</option>
                        <option value="inbox1">Inbox 1</option>
                        <option value="inbox2">Inbox 2</option>
                      </select>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Completed:
                      </label>
                      <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="DD/MM/YYYY"
                        value={lastCompleted}
                        onChange={(e) => setLastCompleted(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Completed By:
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={lastCompletedBy}
                        onChange={(e) => setLastCompletedBy(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date*:
                      </label>
                      <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="DD/MM/YYYY"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                      />
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
                          Statutory*:
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Compliant*:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={compliant}
                        onChange={(e) => setCompliant(e.target.value)}
                        required
                      >
                        <option value="">-</option>
                        {compliantOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
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
