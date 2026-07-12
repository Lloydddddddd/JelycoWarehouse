import Topbar from "../components/Topbar";
import Dashboard from "../components/Dashboard";
import PageHeader from "../components/PageHeader";
import { useState } from "react";
import Modal from "../components/common/Modal";
import Button from "../components/ui/Button";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <>
          <Topbar title="Dashboard" />

          <PageHeader
              title="Dashboard Overview"
              subtitle="Warehouse statistics and inventory summary"
          />

          <Button onClick={() => setOpen(true)}>
              Open Modal
          </Button>

          <Modal
              open={open}
              title="Test Modal"
              onClose={() => setOpen(false)}
          >
              <p>Hello Jelyco Warehouse!</p>
          </Modal>

          <Dashboard />
      </>
    </>
  );
}