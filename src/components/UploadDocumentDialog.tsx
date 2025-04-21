import React, { useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon, DocumentPlusIcon } from "@heroicons/react/24/outline";

// Props definition
interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (documentData: any) => void;
}

// Icons
const CloseIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const UploadIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

export default function UploadDocumentDialog({
  isOpen,
  onClose,
  onUpload,
}: UploadDocumentDialogProps) {
  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("");
  const [code, setCode] = useState("");
  const [reference, setReference] = useState("");
  const [building, setBuilding] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [expiry, setExpiry] = useState("");
  const [isStatutory, setIsStatutory] = useState(false);

  // For drag and drop functionality
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form state when dialog closes
  const handleClose = () => {
    setFile(null);
    setDocType("");
    setCode("");
    setReference("");
    setBuilding("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setValidFrom("");
    setExpiry("");
    setIsStatutory(false);
    onClose();
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const documentData = {
      file,
      docType,
      code,
      reference,
      building,
      description,
      category,
      subCategory,
      validFrom: validFrom ? new Date(validFrom) : null,
      expiry: expiry ? new Date(expiry) : null,
      isStatutory,
    };

    onUpload(documentData);
    handleClose();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Sample option data (replace with actual data from your API/database)
  const docTypes = ["Policy", "Certificate", "Manual", "Standard", "Procedure"];
  const categories = [
    "Health & Safety",
    "Environment",
    "Quality",
    "HR",
    "Finance",
  ];
  const subCategories = [
    "Training",
    "Risk Assessment",
    "Audit",
    "Compliance",
    "Operations",
  ];
  const buildings = ["Building A", "Building B", "Building C", "All buildings"];

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
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Attach Document
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <DocumentPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                    {file ? (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900">
                          Drop file here or click to upload
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, XLS, XLSX up to 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Form fields - 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Doc Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Doc Type
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        required
                      >
                        <option value="">Select Doc Type</option>
                        {docTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Code
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                      />
                    </div>

                    {/* Reference */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Reference
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </div>

                    {/* Building */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Building
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                      >
                        <option value="">Select Building</option>
                        {buildings.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sub Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sub Category
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                      >
                        <option value="">Select Sub Category</option>
                        {subCategories.map((subCat) => (
                          <option key={subCat} value={subCat}>
                            {subCat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Valid From */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Valid From
                      </label>
                      <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={validFrom}
                        onChange={(e) => setValidFrom(e.target.value)}
                      />
                    </div>

                    {/* Expiry */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Expiry
                      </label>
                      <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                    </div>

                    {/* Statutory */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={isStatutory}
                        onChange={(e) => setIsStatutory(e.target.checked)}
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Statutory
                      </label>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Upload
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
