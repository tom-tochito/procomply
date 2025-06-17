"use client";

import { useState } from "react";

interface Activity {
  title: string;
  location: string;
  status?: string;
  team?: string;
  assignee?: string;
}

interface ActivityFeedProps {
  taskActivities: Activity[];
  jobActivities: Activity[];
  docActivities: Activity[];
}

export default function ActivityFeed({ taskActivities, jobActivities, docActivities }: ActivityFeedProps) {
  const [activeActivityTab, setActiveActivityTab] = useState("Task Activity");

  return (
    <div className="col-span-3 lg:col-span-1 rounded-lg border p-4 md:p-5 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Activities</h3>
        <div className="flex items-center">
          <button className="p-1 text-gray-500 hover:text-gray-700 mr-1">
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-base font-medium px-2">Apr 2025</span>
          <button className="p-1 text-gray-500 hover:text-gray-700 ml-1">
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="border-b pb-4 mb-4">
        <div className="flex overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 py-1 hide-scrollbar">
          <button
            onClick={() => setActiveActivityTab("Task Activity")}
            className={`px-2.5 py-1 text-xs rounded-md mr-1.5 whitespace-nowrap ${
              activeActivityTab === "Task Activity"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Task Activity
          </button>
          <button
            onClick={() => setActiveActivityTab("Job Activity")}
            className={`px-2.5 py-1 text-xs rounded-md mr-1.5 whitespace-nowrap ${
              activeActivityTab === "Job Activity"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Job Activity
          </button>
          <button
            onClick={() => setActiveActivityTab("Doc Activity")}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeActivityTab === "Doc Activity"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Doc Activity
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[#F30] font-medium flex items-center">
          Newest Activities
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>

      <div className="space-y-4 text-sm max-h-[250px] md:max-h-[350px] overflow-y-auto pr-2">
        {activeActivityTab === "Task Activity" && (
          <>
            {taskActivities.map((activity, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <strong className="text-[#F30]">{activity.title}</strong>{" "}
                <br />
                <span className="text-gray-700">
                  {activity.location}
                </span>{" "}
                <br />
                {activity.status && (
                  <span className="italic text-gray-500 text-xs mt-1 block">
                    {activity.status}
                  </span>
                )}
                {activity.team && (
                  <span className="flex items-center text-gray-500 text-xs mt-1">
                    <span className="mr-1">Team</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 inline-block mx-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="text-gray-700">{activity.team}</span>
                  </span>
                )}
                {activity.assignee && (
                  <span className="flex items-center text-gray-500 text-xs mt-1">
                    <span className="mr-1">Assignee</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 inline-block mx-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="text-gray-700">
                      {activity.assignee}
                    </span>
                  </span>
                )}
              </div>
            ))}
          </>
        )}

        {activeActivityTab === "Job Activity" && (
          <>
            {jobActivities.map((activity, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <strong className="text-[#F30]">{activity.title}</strong>{" "}
                <br />
                <span className="text-gray-700">
                  {activity.location}
                </span>{" "}
                <br />
                <span className="italic text-gray-500 text-xs mt-1 block">
                  {activity.status}
                </span>
              </div>
            ))}
          </>
        )}

        {activeActivityTab === "Doc Activity" && (
          <>
            {docActivities.map((activity, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <strong className="text-[#F30]">{activity.title}</strong>{" "}
                <br />
                <span className="text-gray-700">
                  {activity.location}
                </span>{" "}
                <br />
                <span className="italic text-gray-500 text-xs mt-1 block">
                  {activity.status}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}