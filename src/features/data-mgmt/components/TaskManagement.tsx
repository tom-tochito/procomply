"use client";

import React, { useState, useEffect, useRef } from "react";
import { Task } from "@/data/tasks";
import TaskDetailsDialog from "./TaskDetailsDialog";
import LabelModal from "./LabelModal";
import TaskModal from "./TaskModal";
import TaskTemplateModal from "@/features/template-mgmt/components/TaskTemplateModal";
import TaskSidebar from "./TaskSidebar";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";

interface TaskModalTaskData {
  taskTemplate?: string;
  taskCategory?: string;
  type?: string;
  instruction?: string;
  building?: string;
  associateToSurvey?: string;
  description?: string;
  reoccurrences?: string;
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
  code?: string;
  name?: string;
  statutory?: string;
  repeatValue?: string;
  repeatUnit?: string;
  amberValue?: string;
  amberUnit?: string;
  observation?: string;
}

interface TaskTemplateModalData {
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

interface TaskManagementProps {
  initialTasks: Task[];
  tenant: string;
}

export default function TaskManagement({
  initialTasks,
}: TaskManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("Active Divisions");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [buildingUse, setBuildingUse] = useState("Building Use");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);

  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [labels, setLabels] = useState([
    { name: "Urgent", color: "#ED1C24" },
    { name: "Important", color: "#F7941D" },
    { name: "Statutory", color: "#39B54A" },
  ]);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTemplateModalOpen, setTaskTemplateModalOpen] = useState(false);
  const [addTaskDropdownOpen, setAddTaskDropdownOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplateModalData | null>(null);
  const addTaskButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        addTaskButtonRef.current &&
        !addTaskButtonRef.current.contains(event.target as Node)
      ) {
        setAddTaskDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredTasks = initialTasks.filter((task) => {
    if (
      searchTerm &&
      !task.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !task.id.includes(searchTerm)
    ) {
      return false;
    }

    if (selectedDivision !== "Active Divisions") {
      return true;
    }

    if (selectedTeam && task.team !== selectedTeam) {
      return false;
    }

    if (selectedAssignee && task.assignee !== selectedAssignee) {
      return false;
    }

    if (
      activeTab === "survey" &&
      !task.description.toLowerCase().includes("survey")
    ) {
      return false;
    }

    return true;
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSaveLabel = (labelData: { name: string; color: string }) => {
    setLabels([...labels, labelData]);
  };

  const handleSaveTask = (taskData: TaskModalTaskData) => {
    console.log("New task created:", taskData);
    setTaskModalOpen(false);
  };

  const handleAddTaskOption = (option: string) => {
    if (option === "blank") {
      setTaskModalOpen(true);
    } else if (option === "template") {
      setTaskTemplateModalOpen(true);
    }
    setAddTaskDropdownOpen(false);
  };

  const handleSelectTemplate = (template: TaskTemplateModalData) => {
    console.log("Selected template:", template);
    setSelectedTemplate(template);
    setTaskModalOpen(true);
  };

  return (
    <>
      {selectedTask && (
        <TaskDetailsDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          task={selectedTask}
          building={{ name: `Building ${selectedTask.building_id}` }}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <button
          className="block lg:hidden rounded-md border p-2 text-gray-600 hover:bg-gray-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {sidebarOpen && (
          <TaskSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            labels={labels}
            onLabelModalOpen={() => setLabelModalOpen(true)}
          />
        )}

        <div className="flex-1 order-1 lg:order-2">
          <div className="relative">
            <TaskFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDivision={selectedDivision}
              setSelectedDivision={setSelectedDivision}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam}
              selectedAssignee={selectedAssignee}
              setSelectedAssignee={setSelectedAssignee}
              buildingUse={buildingUse}
              setBuildingUse={setBuildingUse}
              onAddTaskClick={() => setAddTaskDropdownOpen(!addTaskDropdownOpen)}
              onColumnsMenuToggle={() => setColumnsMenuOpen(!columnsMenuOpen)}
            />

            {addTaskDropdownOpen && (
              <div 
                className="absolute top-full right-36 mt-1 w-48 bg-white rounded-md shadow-lg z-30 py-1 border border-gray-200"
                ref={addTaskButtonRef}
              >
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddTaskOption("template");
                  }}
                >
                  Start from template
                </div>
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddTaskOption("blank");
                  }}
                >
                  Start from blank task
                </div>
              </div>
            )}
          </div>

          <TaskTable
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            columnsMenuOpen={columnsMenuOpen}
            setColumnsMenuOpen={setColumnsMenuOpen}
          />
        </div>
      </div>

      <LabelModal
        isOpen={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        onSave={handleSaveLabel}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setSelectedTemplate(null);
        }}
        onSave={handleSaveTask}
        templateData={selectedTemplate || undefined}
      />

      <TaskTemplateModal
        isOpen={taskTemplateModalOpen}
        onClose={() => setTaskTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </>
  );
}