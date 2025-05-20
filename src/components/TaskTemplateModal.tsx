import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Props definition
interface TaskTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TaskTemplate) => void;
}

// Define a type for the template data
interface TaskTemplate {
  code: string;
  name: string;
  observation: string;
  instruction: string;
  riskArea: string;
  subsection: string;
  priority: string;
  riskLevel: string;
  statutory: string;
  repeatValue: string;
  repeatUnit: string;
  amberValue: string;
  amberUnit: string;
}

export default function TaskTemplateModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: TaskTemplateModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock template data based on the screenshot
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

  // Filter templates based on search
  const filteredTemplates = templates.filter((template) => {
    if (!searchTerm) return true;
    return (
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.riskArea.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSelectTemplate = (template: TaskTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-6xl transform rounded-lg bg-white shadow-xl transition-all overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <Dialog.Title className="text-base font-medium text-gray-900">
                    Select Task Template
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-4">
                  {/* Search */}
                  <div className="mb-4">
                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        placeholder="Search templates"
                        className="border rounded-md pl-3 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Template table */}
                  <div className="border rounded-md overflow-hidden">
                    <div className="overflow-x-auto max-h-96">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th
                              scope="col"
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Code
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Risk Area
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Subsection
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Priority
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Risk Level
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredTemplates.map((template) => (
                            <tr
                              key={template.code}
                              className="hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => handleSelectTemplate(template)}
                            >
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {template.code}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {template.name}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {template.riskArea}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {template.subsection}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {template.priority}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {template.riskLevel}
                              </td>
                            </tr>
                          ))}
                          {filteredTemplates.length === 0 && (
                            <tr>
                              <td
                                colSpan={6}
                                className="px-3 py-4 text-center text-sm text-gray-500"
                              >
                                No templates found matching your search.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
