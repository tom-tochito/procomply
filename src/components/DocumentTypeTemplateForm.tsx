import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

// Props definition
interface DocumentTypeTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: DocumentTypeTemplateData) => void;
  editData?: DocumentTypeTemplateData; // Optional template data to pre-fill for editing
}

// Define a type for the document type template data
interface DocumentTypeTemplateData {
  code: string;
  description: string;
  title: string;
  statutory: string; // "Yes" or "No"
  category: string;
  subCategory: string;
  repeatValue: string;
  repeatUnit: string;
}

export default function DocumentTypeTemplateForm({
  isOpen,
  onClose,
  onSave,
  editData,
}: DocumentTypeTemplateFormProps) {
  // Form state for all fields in the modal
  const [code, setCode] = useState(editData?.code || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [title, setTitle] = useState(editData?.title || "");
  const [isStatutory, setIsStatutory] = useState(
    editData?.statutory === "Yes" || false
  );
  const [category, setCategory] = useState(editData?.category || "");
  const [subCategory, setSubCategory] = useState(editData?.subCategory || "");
  const [repeatValue, setRepeatValue] = useState(editData?.repeatValue || "");
  const [repeatUnit, setRepeatUnit] = useState(editData?.repeatUnit || "");

  // Field options based on the screenshot
  const categoryOptions = ["Fire", "Electrical", "Miscellaneous", "Asbestos"];
  const subCategoryOptions = {
    Fire: ["Inspection", "Test Record"],
    Electrical: ["Register"],
    Miscellaneous: ["Service Record"],
    Asbestos: ["Assessment", "Certificate", "Survey", "Management Plan"],
  };
  const unitOptions = ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"];

  // Get sub-category options based on selected category
  const getSubCategoryOptions = () => {
    if (category && subCategoryOptions[category]) {
      return subCategoryOptions[category];
    }
    return [];
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      code,
      description,
      title,
      statutory: isStatutory ? "Yes" : "No",
      category,
      subCategory,
      repeatValue,
      repeatUnit,
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
                    {editData
                      ? "Edit Document Type Template"
                      : "New Document Type Template"}
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
                        placeholder="e.g. FDIR"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description*:
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title*:
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                          Statutory
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category*:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setSubCategory(""); // Reset sub-category when category changes
                        }}
                        required
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
                        Sub Category:
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        disabled={!category}
                      >
                        <option value="">-</option>
                        {getSubCategoryOptions().map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
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
