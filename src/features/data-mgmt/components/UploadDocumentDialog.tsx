"use client";

import React, { useState, useRef, useActionState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FilePlus, FileText, Hash, Tag, Building2, Calendar, Shield, Info } from "lucide-react";
import { uploadDocumentForDataMgmtAction } from "@/features/data-mgmt/actions/document-upload.action";
import { FormState } from "@/common/types/form";
import { db } from "~/lib/db";
import { Tenant } from "@/features/tenant/models";
import { Building } from "@/features/buildings/models";

// Props definition
interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: Tenant;
  defaultBuilding?: Building;
}


export default function UploadDocumentDialog({
  isOpen,
  onClose,
  tenant,
  defaultBuilding,
}: UploadDocumentDialogProps) {
  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("");
  const [code, setCode] = useState("");
  const [reference, setReference] = useState("");
  const [building, setBuilding] = useState(defaultBuilding?.id || "");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [expiry, setExpiry] = useState("");
  const [isStatutory, setIsStatutory] = useState(false);

  // For drag and drop functionality
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use action state for form submission
  const initialState: FormState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(
    uploadDocumentForDataMgmtAction,
    initialState
  );
  
  // Subscribe to buildings if tenant is provided
  const { data: buildingsData, isLoading: buildingsLoading } = tenant ? db.useQuery({
    buildings: {
      $: {
        where: {
          tenant: tenant.id,
        },
      },
    },
  }) : { data: null, isLoading: false };
  
  const buildings = buildingsData?.buildings || [];

  // Reset form state when dialog closes or on success
  const handleClose = () => {
    setFile(null);
    setDocType("");
    setCode("");
    setReference("");
    setBuilding(defaultBuilding?.id || "");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setDocCategory("");
    setValidFrom("");
    setExpiry("");
    setIsStatutory(false);
    onClose();
  };
  
  // Handle successful upload
  React.useEffect(() => {
    if (state.success) {
      handleClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  // Remove handleSubmit as we'll use form action instead

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
  // Buildings are now fetched from InstantDB
  const docCategories = [
    "Asbestos",
    "Electrical",
    "Energy",
    "Environmental",
    "Equality / Disability",
    "Fire",
    "Gas",
    "Health and Safety",
    "Legionella",
    "Lift",
    "Miscellaneous",
    "Operation",
    "Third Party",
  ];

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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-4 sm:p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-base sm:text-lg font-medium text-gray-900">
                    Attach Document
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                    aria-label="Close dialog"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <form action={formAction} className="space-y-4">
                  {/* Hidden fields for server action */}
                  {tenant && <input type="hidden" name="tenantId" value={tenant.id} />}
                  
                  {/* Error display */}
                  {state.error && (
                    <div className="rounded-lg bg-red-50 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <X className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">{state.error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-[#F30] bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
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
                      name="file"
                    />
                    <FilePlus className="mx-auto h-12 w-12 text-gray-400" />
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
                          Any file type up to 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Form fields - scrollable container for mobile */}
                  <div className="max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
                    {/* Form fields - 2 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Doc Type */}
                      <div>
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          <FileText className="h-4 w-4 text-gray-400" />
                          Doc Type
                        </label>
                        <select
                          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-[#F30] focus:outline-none focus:ring-2 focus:ring-[#F30]/20 hover:border-gray-400"
                          name="docType"
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          required
                          disabled={isPending}
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
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          <Hash className="h-4 w-4 text-gray-400" />
                          Code
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-[#F30] focus:outline-none focus:ring-2 focus:ring-[#F30]/20 hover:border-gray-400"
                          name="code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                          disabled={isPending}
                        />
                      </div>

                      {/* Reference */}
                      <div>
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          <Tag className="h-4 w-4 text-gray-400" />
                          Reference
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-[#F30] focus:outline-none focus:ring-2 focus:ring-[#F30]/20 hover:border-gray-400"
                          name="reference"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                          disabled={isPending}
                        />
                      </div>

                      {/* Building */}
                      <div>
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          Building
                        </label>
                        <select
                          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-[#F30] focus:outline-none focus:ring-2 focus:ring-[#F30]/20 hover:border-gray-400"
                          name="buildingId"
                          value={building}
                          onChange={(e) => setBuilding(e.target.value)}
                          required
                          disabled={isPending || !!defaultBuilding}
                        >
                          <option value="">
                            {buildingsLoading ? "Loading..." : "Select Building (Required)"}
                          </option>
                          {!buildingsLoading && buildings.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Doc Category */}
                      <div>
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          <Shield className="h-4 w-4 text-gray-400" />
                          Doc Category
                        </label>
                        <select
                          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-[#F30] focus:outline-none focus:ring-2 focus:ring-[#F30]/20 hover:border-gray-400"
                          name="docCategory"
                          value={docCategory}
                          onChange={(e) => setDocCategory(e.target.value)}
                          required
                          disabled={isPending}
                        >
                          <option value="">Select Doc Category</option>
                          {docCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          <Tag className="h-4 w-4 text-gray-400" />
                          Category
                        </label>
                        <select
                          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-[#F30] focus:outline-none focus:ring-2 focus:ring-[#F30]/20 hover:border-gray-400"
                          name="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                          disabled={isPending}
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
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          <Tag className="h-4 w-4 text-gray-400" />
                          Sub Category
                        </label>
                        <select
                          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-[#F30] focus:outline-none focus:ring-2 focus:ring-[#F30]/20 hover:border-gray-400"
                          name="subCategory"
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                          disabled={isPending}
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
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          Valid From
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-[#F30] focus:outline-none focus:ring-2 focus:ring-[#F30]/20 hover:border-gray-400"
                          name="validFrom"
                          value={validFrom}
                          onChange={(e) => setValidFrom(e.target.value)}
                          disabled={isPending}
                        />
                      </div>

                      {/* Expiry */}
                      <div>
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          Expiry
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-[#F30] focus:outline-none focus:ring-2 focus:ring-[#F30]/20 hover:border-gray-400"
                          name="expiry"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          disabled={isPending}
                        />
                      </div>

                      {/* Description - full width */}
                      <div className="sm:col-span-2">
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          <Info className="h-4 w-4 text-gray-400" />
                          Description
                        </label>
                        <textarea
                          rows={2}
                          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-[#F30] focus:outline-none focus:ring-2 focus:ring-[#F30]/20 hover:border-gray-400 resize-none"
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                          disabled={isPending}
                        />
                      </div>

                      {/* Statutory */}
                      <div className="flex items-center sm:col-span-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#F30] focus:ring-[#F30] transition-colors"
                          name="isStatutory"
                          checked={isStatutory}
                          onChange={(e) => setIsStatutory(e.target.checked)}
                          disabled={isPending}
                        />
                        <label className="ml-2 block text-xs sm:text-sm text-gray-700">
                          Statutory
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      className="rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                      onClick={handleClose}
                      disabled={isPending}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-lg border border-transparent bg-[#F30] py-2 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#E20] focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isPending || !file}
                    >
                      {isPending ? "Uploading..." : "Upload"}
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
