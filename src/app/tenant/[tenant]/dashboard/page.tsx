import SummaryCard from "@/features/dashboard/components/SummaryCard";
import TaskChart from "@/features/dashboard/components/TaskChart";
import ActivityFeed from "@/features/dashboard/components/ActivityFeed";
import UpcomingInspections from "@/features/dashboard/components/UpcomingInspections";
import ComplianceStatus from "@/features/dashboard/components/ComplianceStatus";
import QuickActions from "@/features/dashboard/components/QuickActions";
import { requireAuth } from "@/features/auth";
import { dbAdmin } from "~/lib/db-admin";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";

interface DashboardPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { tenant } = await params;
  await requireAuth(tenant);
  
  // Get tenant data
  const tenantData = await findTenantBySlug(tenant);
  if (!tenantData) {
    throw new Error("Tenant not found");
  }

  // Fetch dashboard data from InstantDB
  const [
    buildingsResult,
    tasksResult,
    divisionsResult,
    inspectionsResult,
    documentsResult,
    complianceChecksResult
  ] = await Promise.all([
    // Buildings count
    dbAdmin.query({
      buildings: {
        $: {
          where: { "tenant.id": tenantData.id },
        },
      },
    }),
    // Tasks data
    dbAdmin.query({
      tasks: {
        $: {
          where: { "tenant.id": tenantData.id },
        },
        building: {},
        assignee: {},
      },
    }),
    // Divisions for grouping
    dbAdmin.query({
      divisions: {
        $: {
          where: { "tenant.id": tenantData.id },
        },
        buildings: {},
      },
    }),
    // Recent inspections
    dbAdmin.query({
      inspections: {
        $: {
          where: { "tenant.id": tenantData.id },
          order: { createdAt: "desc" },
          limit: 5,
        },
        building: {},
      },
    }),
    // Recent documents
    dbAdmin.query({
      documents: {
        $: {
          where: { "tenant.id": tenantData.id },
          order: { uploadedAt: "desc" },
          limit: 5,
        },
        building: {},
        uploader: {},
      },
    }),
    // Compliance checks
    dbAdmin.query({
      complianceChecks: {
        $: {
          where: { "tenant.id": tenantData.id },
        },
        building: {},
      },
    }),
  ]);

  // Calculate statistics
  const totalBuildings = buildingsResult.buildings.length;
  const totalTasks = tasksResult.tasks.length;
  const completedTasks = tasksResult.tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const outstandingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Group tasks by division
  const tasksByDivision: Record<string, { total: number; completed: number; inProgress: number; notStarted: number; onHold: number }> = {};
  
  divisionsResult.divisions.forEach((division) => {
    const divisionBuildingIds = division.buildings?.map(b => b.id) || [];
    const divisionTasks = tasksResult.tasks.filter(
      task => task.building && divisionBuildingIds.includes(task.building.id)
    );
    
    tasksByDivision[division.name] = {
      total: divisionTasks.length,
      completed: divisionTasks.filter(t => t.status === "completed").length,
      inProgress: divisionTasks.filter(t => t.status === "in_progress").length,
      notStarted: divisionTasks.filter(t => t.status === "pending").length,
      onHold: divisionTasks.filter(t => t.status === "on_hold").length,
    };
  });

  // Add "Leased" category for buildings without division
  const leasedTasks = tasksResult.tasks.filter(
    task => !task.building || !divisionsResult.divisions.some(
      d => d.buildings?.some(b => b.id === task.building?.id)
    )
  );
  
  if (leasedTasks.length > 0) {
    tasksByDivision["Leased"] = {
      total: leasedTasks.length,
      completed: leasedTasks.filter(t => t.status === "completed").length,
      inProgress: leasedTasks.filter(t => t.status === "in_progress").length,
      notStarted: leasedTasks.filter(t => t.status === "pending").length,
      onHold: leasedTasks.filter(t => t.status === "on_hold").length,
    };
  }

  // Prepare chart data
  const chartData = {
    labels: Object.keys(tasksByDivision),
    datasets: [
      {
        label: `Completed - ${completedTasks} tasks`,
        data: Object.values(tasksByDivision).map(d => d.completed),
        backgroundColor: "#4caf50",
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: `Outstanding (In Progress) - ${Object.values(tasksByDivision).reduce((sum, d) => sum + d.inProgress, 0)} tasks`,
        data: Object.values(tasksByDivision).map(d => d.inProgress),
        backgroundColor: "#f44336",
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: `Outstanding (Not Started) - ${Object.values(tasksByDivision).reduce((sum, d) => sum + d.notStarted, 0)} tasks`,
        data: Object.values(tasksByDivision).map(d => d.notStarted),
        backgroundColor: "#ff7575",
        stack: "stack1",
        borderRadius: 4,
      },
      {
        label: `Outstanding (On Hold) - ${Object.values(tasksByDivision).reduce((sum, d) => sum + d.onHold, 0)} tasks`,
        data: Object.values(tasksByDivision).map(d => d.onHold),
        backgroundColor: "#9999ff",
        stack: "stack1",
        borderRadius: 4,
      },
    ],
  };

  // Format recent activities
  const taskActivities = tasksResult.tasks.slice(0, 5).map((task) => ({
    title: task.title,
    location: task.building?.name || "Unknown location",
    status: task.status === "completed" ? "Completed" : 
           task.status === "in_progress" ? "In Progress" :
           task.status === "on_hold" ? "On Hold" : "Created",
    ...(task.assignee && { assignee: task.assignee.email }),
  }));

  const jobActivities = inspectionsResult.inspections.map((inspection) => ({
    title: inspection.type,
    location: inspection.building?.name || "Unknown location",
    status: inspection.status === "completed" ? "Completed" :
           inspection.status === "scheduled" ? "Scheduled" :
           inspection.status === "in_progress" ? "In Progress" : inspection.status,
  }));

  const docActivities = documentsResult.documents.map((doc) => ({
    title: doc.name,
    location: doc.building?.name || "Company-wide",
    status: `Uploaded by ${doc.uploader?.email || "Unknown"}`,
  }));

  // Chart options
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary cards - horizontal on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            title="Total Tasks"
            value={totalTasks.toString()}
            subtitle="Across all properties"
            accentColor="border-[#F30]"
          />
          <SummaryCard
            title="Completed"
            value={completedTasks.toString()}
            subtitle={`${completionRate.toFixed(1)}% completion rate`}
            accentColor="border-green-500"
          />
          <SummaryCard
            title="Outstanding"
            value={outstandingTasks.toString()}
            subtitle="Requires attention"
            accentColor="border-red-500"
          />
          <SummaryCard
            title="Properties"
            value={totalBuildings.toString()}
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
          <UpcomingInspections inspections={inspectionsResult.inspections} tenant={tenant} />
          <ComplianceStatus complianceChecks={complianceChecksResult.complianceChecks} tenant={tenant} />
          <QuickActions tenant={tenant} />
        </div>
      </div>
    </div>
  );
}