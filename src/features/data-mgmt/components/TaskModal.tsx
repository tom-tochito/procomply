import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

// Props definition
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskData) => void;
  templateData?: TaskData; // Optional template data to pre-fill the form
}

// Define a type for the task data
interface TaskData {
  taskTemplate?: string;
  taskCategory?: string;
  type?: string;
  instruction?: string;
  building?: string;
  associateToSurvey?: string;
  description?: string; // This seems to take templateData.observation
  reoccurrences?: string;
  // observation?: string; // Removed as setObservation is unused
  inbox?: string;
  riskArea?: string;
  subsection?: string;
  priority?: string;
  riskLevel?: string;
  lastCompleted?: string;
  lastCompletedBy?: string;
  dueDate?: string;
  isStatutory?: boolean;
  compliant?: string;
  // Template-specific fields that might be part of templateData but not direct task state
  code?: string; // From template
  name?: string; // From template
  statutory?: string; // From template, maps to isStatutory
  repeatValue?: string; // From template
  repeatUnit?: string; // From template
  amberValue?: string; // From template
  amberUnit?: string; // From template
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  templateData,
}: TaskModalProps) {
  // Form state for all fields in the modal
  const [taskTemplate, setTaskTemplate] = useState(templateData?.code || "");
  const [taskCategory, setTaskCategory] = useState(
    templateData?.taskCategory || ""
  );
  const [type, setType] = useState(templateData?.type || "");
  const [instruction, setInstruction] = useState(
    templateData?.instruction || ""
  );
  const [building, setBuilding] = useState(templateData?.building || "");
  const [associateToSurvey, setAssociateToSurvey] = useState(
    templateData?.associateToSurvey || ""
  );
  const [description, setDescription] = useState(
    templateData?.description || ""
  );
  const [reoccurrences, setReoccurrences] = useState(
    templateData?.reoccurrences || ""
  );
  // const [observation, setObservation] = useState(""); // Removed as setObservation is unused (error 32:23)
  const [inbox, setInbox] = useState(templateData?.inbox || "");
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
  // List of templates matching the ones in TaskTemplateModal
  const templates = [
    {
      code: "TT-661439",
      name: "6 Monthly Fire Alarm Service",
      observation: "6 monthly service to the fire alarm system",
      instruction: "Inspect and test the fire alarm system",
      riskArea: "Fire",
      subsection: "Inspection",
      priority: "High",
      riskLevel: "Medium",
      statutory: "Yes",
      repeatValue: "6",
      repeatUnit: "MONTHLY",
      amberValue: "1",
      amberUnit: "MONTHLY",
    },
    {
      code: "TT-412241",
      name: "6 Monthly Fire Extinguisher Service",
      observation: "No records of service found",
      instruction: "Service the fire extinguishers",
      riskArea: "Fire",
      subsection: "Fire Alarm System",
      priority: "High",
      riskLevel: "Medium",
      statutory: "Yes",
      repeatValue: "6",
      repeatUnit: "MONTHLY",
      amberValue: "2",
      amberUnit: "WEEKLY",
    },
    {
      code: "TT-395976",
      name: "Access Door Controls",
      observation: "The door is not closing properly",
      instruction: "The door should be fixed",
      riskArea: "Health & Safety",
      subsection: "",
      priority: "High",
      riskLevel: "High",
      statutory: "Yes",
      repeatValue: "0",
      repeatUnit: "YEARLY",
      amberValue: "1",
      amberUnit: "MONTHLY",
    },
    {
      code: "TT-453827",
      name: "Access to Dry Riser",
      observation: "There is a blockage to the dry riser",
      instruction: "Ensure clear access to the dry riser",
      riskArea: "Fire",
      subsection: "Fire Hazards",
      priority: "High",
      riskLevel: "Medium",
      statutory: "Yes",
      repeatValue: "0",
      repeatUnit: "YEARLY",
      amberValue: "1",
      amberUnit: "MONTHLY",
    },
    {
      code: "TT-363623",
      name: "Add Cross Sectional Drawings",
      observation: "This installation requires cross sectional drawings",
      instruction: "Add cross sectional drawings to the installation",
      riskArea: "Electrical",
      subsection: "Label",
      priority: "Medium",
      riskLevel: "Medium",
      statutory: "Yes",
      repeatValue: "0",
      repeatUnit: "",
      amberValue: "1",
      amberUnit: "YEARLY",
    },
  ];

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

  // Function to handle template selection and auto-fill fields
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTemplateCode = e.target.value;
    setTaskTemplate(selectedTemplateCode);

    if (selectedTemplateCode) {
      const selectedTemplate = templates.find(
        (t) => t.code === selectedTemplateCode
      );
      if (selectedTemplate) {
        // Auto-fill fields from the selected template
        setInstruction(selectedTemplate.instruction || "");
        setDescription(selectedTemplate.observation || "");
        setRiskArea(selectedTemplate.riskArea || "");
        setSubsection(selectedTemplate.subsection || "");
        setPriority(selectedTemplate.priority || "");
        setRiskLevel(selectedTemplate.riskLevel || "");
        setIsStatutory(selectedTemplate.statutory === "Yes");
      }
    }
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
                        onChange={handleTemplateChange}
                      >
                        <option value="">-</option>
                        {templates.map((template) => (
                          <option key={template.code} value={template.code}>
                            {template.name}
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
