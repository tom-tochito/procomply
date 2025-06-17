import Header from "@/common/components/Header/Header";
import SummaryCard from "@/features/dashboard/components/SummaryCard";
import TaskChart from "@/features/dashboard/components/TaskChart";
import ActivityFeed from "@/features/dashboard/components/ActivityFeed";
import CompanyDocuments from "@/features/dashboard/components/CompanyDocuments";
import LegislationSection from "@/features/dashboard/components/LegislationSection";
import QuickActions from "@/features/dashboard/components/QuickActions";

interface DashboardPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { tenant } = await params;

  // Sample activities data
  const taskActivities = [
    {
      title: "Monthly H&S Visit (Includes Temp & Lights)",
      location: "40050 Sidcup House",
      status: "Created this task",
    },
    {
      title: "Monthly H&S Visit (Includes Temp & Lights)",
      location: "40050 Sidcup House",
      team: "ASAP Comply Ltd",
      assignee: "Mark Burchall (ASAP)",
    },
    {
      title: "Quarterly Communal Fire Door Inspections",
      location: "40126 Orion House",
      status: "Visited awaiting report",
    },
    {
      title: "Quarterly Communal Fire Door Inspections",
      location: "40008 Stirling Court",
      status: "Put on hold by Marta",
    },
    {
      title: "Quarterly Communal Fire Door Inspections",
      location: "40071 Gloucester Place",
      status: "Removed from scope by Marta",
    },
  ];

  const jobActivities = [
    {
      title: "Fire Risk Assessment",
      location: "40126 Orion House",
      status: "Job assigned to London Fire Division",
    },
    {
      title: "Asbestos Surveys",
      location: "40008 Stirling Court",
      status: "Survey completed, awaiting report",
    },
    {
      title: "Fire Alarm Testing",
      location: "40071 Gloucester Place",
      status: "Job scheduled for next week",
    },
  ];

  const docActivities = [
    {
      title: "Fire Risk Assessment Report",
      location: "40126 Orion House",
      status: "Document uploaded by John Smith",
    },
    {
      title: "Asbestos Survey Report",
      location: "40008 Stirling Court",
      status: "Document pending approval",
    },
    {
      title: "Health & Safety Policy",
      location: "Company-wide",
      status: "Document updated by Admin",
    },
  ];

  const chartData = {
    labels: ["Camden", "Hampstead", "Ealing", "Leased"],
    datasets: [
      {
        label: "Completed - 891 tasks",
        data: [312, 355, 217, 7],
        backgroundColor: "#4caf50",
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: "Outstanding (In Progress) - 36 tasks",
        data: [12, 10, 8, 6],
        backgroundColor: "#f44336",
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: "Outstanding (Not Started) - 68 tasks",
        data: [25, 20, 18, 5],
        backgroundColor: "#ff7575",
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: "Outstanding (On Hold) - NaN tasks",
        data: [0, 0, 0, 0],
        backgroundColor: "#9999ff",
        stack: "stack1",
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 20,
          font: {
            size: 12,
          },
        },
        display: true,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 6,
        displayColors: true,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: "bold" as const,
          },
        },
      },
    },
    barThickness: 30,
    maxBarThickness: 35,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary cards - horizontal on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            title="Total Tasks"
            value="995"
            subtitle="Across all properties"
            accentColor="border-[#F30]"
          />
          <SummaryCard
            title="Completed"
            value="891"
            subtitle="89.5% completion rate"
            accentColor="border-green-500"
          />
          <SummaryCard
            title="Outstanding"
            value="104"
            subtitle="Requires attention"
            accentColor="border-red-500"
          />
          <SummaryCard
            title="Properties"
            value="4"
            subtitle="Under management"
            accentColor="border-purple-500"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TaskChart data={chartData} options={chartOptions} />
          <ActivityFeed
            taskActivities={taskActivities}
            jobActivities={jobActivities}
            docActivities={docActivities}
          />
        </div>

        {/* Bottom cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <CompanyDocuments />
          <LegislationSection />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}