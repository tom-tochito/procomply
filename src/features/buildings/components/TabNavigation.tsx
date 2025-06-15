"use client";

import React from "react";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  taskCount: number;
}

export default function TabNavigation({ activeTab, setActiveTab, taskCount }: TabNavigationProps) {
  const tabs = [
    { id: "details", label: "Building Details" },
    { id: "tasks", label: `Tasks (${taskCount})` },
    { id: "documents", label: "Documents" },
    { id: "contacts", label: "Contacts" },
    { id: "notes", label: "Notes" },
    { id: "yearplanner", label: "Year Planner" },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#F30] text-[#F30]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}