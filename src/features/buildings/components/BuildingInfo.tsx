"use client";

import React, { useState } from "react";
import { Building, BuildingWithTemplate } from "@/features/buildings/models";
import { Division } from "@/features/divisions/models";
import { TemplateField } from "@/features/templates/models";
import EditBuildingModal from "./EditBuildingModal";
import DynamicFieldDisplay from "./DynamicFieldDisplay";

interface BuildingInfoProps {
  building: Building | BuildingWithTemplate;
  divisions?: Division[];
}

export default function BuildingInfo({ building, divisions = [] }: BuildingInfoProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const renderTemplateFields = () => {
    const buildingWithTemplate = building as BuildingWithTemplate;
    
    if (!buildingWithTemplate.template) {
      return (
        <div className="p-8 text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium mb-2">No Template Assigned</p>
          <p className="text-sm">This building doesn&apos;t have a template assigned yet.</p>
          <p className="text-sm">Templates define which fields are available for this building.</p>
        </div>
      );
    }

    const templateFields = buildingWithTemplate.template.fields || [];
    const buildingData = building.data || {};

    if (templateFields.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium mb-2">No Fields Defined</p>
          <p className="text-sm">The template doesn&apos;t have any custom fields defined.</p>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Template: <span className="font-medium text-gray-900">{buildingWithTemplate.template.name}</span>
          </p>
        </div>
        <dl className="divide-y divide-gray-200">
          {templateFields.map((field: TemplateField) => (
            <DynamicFieldDisplay
              key={field.key}
              field={field}
              value={buildingData[field.key]}
            />
          ))}
        </dl>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Basic Building Info */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <h3 className="text-md font-medium">Building Information</h3>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3 py-1 bg-[#F30] text-white text-sm font-medium rounded hover:bg-[#E20] transition-colors"
          >
            Edit Building
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-gray-500">Name:</div>
            <div className="font-medium">{building.name}</div>
          </div>
          
          {building.division && (
            <div>
              <div className="text-sm text-gray-500">Division:</div>
              <div className="font-medium">{building.division}</div>
            </div>
          )}
          
          <div>
            <div className="text-sm text-gray-500">Created:</div>
            <div className="font-medium">{new Date(building.createdAt).toLocaleDateString()}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500">Last Updated:</div>
            <div className="font-medium">{new Date(building.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Template-based Fields */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-md font-medium">Building Details</h3>
        </div>
        {renderTemplateFields()}
      </div>
      
      {/* Edit Building Modal */}
      <EditBuildingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        building={building}
        divisions={divisions}
      />
    </div>
  );
}