"use client";

import React, { useState } from "react";

interface YearPlannerTabProps {
  buildingId: string;
}

interface PlannerTask {
  id: number;
  task: string;
  frequency: string;
  team: string;
  assignee: string;
  scheduledDate: string;
  weekPositions: { [key: string]: boolean };
}

export default function YearPlannerTab({ buildingId }: YearPlannerTabProps) {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock tasks data
  const tasks: PlannerTask[] = [
    {
      id: 1,
      task: "Fire Alarm Testing",
      frequency: "Monthly",
      team: "ASAP Comply Ltd",
      assignee: "Mark Burchall",
      scheduledDate: "15/01/2025",
      weekPositions: { "jan-12": true }
    },
    {
      id: 2,
      task: "Quarterly Fire Door Inspection",
      frequency: "Quarterly", 
      team: "ASAP Comply Ltd",
      assignee: "John Wade",
      scheduledDate: "28/02/2025",
      weekPositions: { "feb-23": true }
    },
    {
      id: 3,
      task: "Annual Fire Risk Assessment",
      frequency: "Annual",
      team: "ASAP Comply Ltd",
      assignee: "Wayne Ross",
      scheduledDate: "28/04/2025",
      weekPositions: { "apr-27": true }
    }
  ];

  // Calendar structure
  const months = [
    { name: "Dec", weeks: [{ date: "29", key: "dec-29" }] },
    { name: "Jan", weeks: [
      { date: "05", key: "jan-05" },
      { date: "12", key: "jan-12" },
      { date: "19", key: "jan-19" },
      { date: "26", key: "jan-26" }
    ]},
    { name: "Feb", weeks: [
      { date: "02", key: "feb-02" },
      { date: "09", key: "feb-09" },
      { date: "16", key: "feb-16" },
      { date: "23", key: "feb-23" }
    ]},
    { name: "Mar", weeks: [
      { date: "02", key: "mar-02" },
      { date: "09", key: "mar-09" },
      { date: "16", key: "mar-16" },
      { date: "23", key: "mar-23" }
    ]},
    { name: "Apr", weeks: [
      { date: "30", key: "apr-30" },
      { date: "06", key: "apr-06" },
      { date: "13", key: "apr-13" },
      { date: "20", key: "apr-20" }
    ]},
    { name: "May", weeks: [
      { date: "27", key: "may-27" },
      { date: "04", key: "may-04" },
      { date: "11", key: "may-11" },
      { date: "18", key: "may-18" }
    ]}
  ];

  const filteredTasks = tasks.filter(task => 
    task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="search tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md pl-3 pr-10 py-2 w-full"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50">CSV</button>
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
              onClick={() => {/* Year selector logic */}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{selectedYear}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Year planner table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="min-w-max w-full border-collapse">
            <thead>
              {/* Month header row */}
              <tr className="bg-gray-50 border-b">
                <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">#</th>
                <th className="sticky left-12 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r min-w-[200px]">Task</th>
                <th className="sticky left-[248px] z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r w-[80px]">Freq</th>
                <th className="sticky left-[328px] z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r min-w-[150px]">Team</th>
                <th className="sticky left-[478px] z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r min-w-[150px]">Assignee</th>
                <th className="sticky left-[628px] z-10 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 border-r min-w-[120px]">Sched Date</th>

                {/* Month headers */}
                {months.map((month, idx) => (
                  <th
                    key={month.name}
                    className={`px-1 py-2 text-center text-sm font-medium text-gray-700 ${idx < months.length - 1 ? 'border-r' : ''} border-b`}
                    colSpan={month.weeks.length}
                  >
                    <div>{month.name}</div>
                  </th>
                ))}
              </tr>

              {/* Week dates row */}
              <tr className="bg-gray-50 border-b">
                <th className="sticky left-0 z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>
                <th className="sticky left-12 z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>
                <th className="sticky left-[248px] z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>
                <th className="sticky left-[328px] z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>
                <th className="sticky left-[478px] z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>
                <th className="sticky left-[628px] z-10 bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-700 border-r"></th>

                {/* Week dates */}
                {months.map((month) => 
                  month.weeks.map((week, idx) => (
                    <th key={week.key} className="px-1 py-2 text-center text-xs font-medium text-gray-700 border-r w-[40px]">
                      {week.date}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm border-r">{task.id}</td>
                  <td className="sticky left-12 z-10 bg-white px-4 py-3 text-sm border-r">{task.task}</td>
                  <td className="sticky left-[248px] z-10 bg-white px-4 py-3 text-sm border-r">{task.frequency}</td>
                  <td className="sticky left-[328px] z-10 bg-white px-4 py-3 text-sm border-r">{task.team}</td>
                  <td className="sticky left-[478px] z-10 bg-white px-4 py-3 text-sm border-r">{task.assignee}</td>
                  <td className="sticky left-[628px] z-10 bg-white px-4 py-3 text-sm border-r">{task.scheduledDate}</td>

                  {/* Calendar cells */}
                  {months.map((month) => 
                    month.weeks.map((week) => (
                      <td 
                        key={week.key} 
                        className={`px-0 py-3 text-center border-r ${task.weekPositions[week.key] ? 'bg-blue-100' : ''}`}
                      ></td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="py-3 px-4 border-t text-center sm:text-right text-sm text-gray-700">
          <strong>NO. OF TASKS: {filteredTasks.length}</strong>
        </div>
      </div>
    </div>
  );
}