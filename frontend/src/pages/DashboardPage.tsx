import Topbar from "../components/Topbar";
import Dashboard from "../components/Dashboard";
import PageHeader from "../components/PageHeader";

export default function DashboardPage() {
  return (
    <>
      <>
          <Topbar title="Dashboard" />

          <PageHeader
              title="Dashboard Overview"
              subtitle="Warehouse statistics and inventory summary"
          />

          <Dashboard />
      </>
    </>
  );
}