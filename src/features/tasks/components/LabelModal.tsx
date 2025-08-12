import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

// Props definition
interface LabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (labelData: { name: string; color: string }) => void;
}

export default function LabelModal({
  isOpen,
  onClose,
  onSave,
}: LabelModalProps) {
  const [labelName, setLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#39B54A"); // Default to green

  // Available colors - matches the ones shown in the screenshot
  const colorOptions = [
    "#39B54A", // Green
    "#F7941D", // Orange
    "#ED1C24", // Red
    "#C9252C", // Dark Red
    "#29166F", // Purple
    "#0071BC", // Blue
    "#CCCCCC", // Gray
  ];

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (labelName.trim()) {
      onSave({
        name: labelName.trim(),
        color: selectedColor,
      });
      onClose();
    }
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <Dialog.Title className="text-base font-medium text-gray-900">
                    Add label
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-4">
                  {/* Label input */}
                  <div className="mb-4">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter label name"
                      value={labelName}
                      onChange={(e) => setLabelName(e.target.value)}
                    />
                  </div>

                  {/* Color options */}
                  <div className="flex space-x-2 justify-center mb-4">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full ${
                          selectedColor === color
                            ? "ring-2 ring-offset-2 ring-blue-500"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>

                  {/* Save button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
