import { useEffect, useMemo, useState } from "react";

import { exportToCsv } from "../utils/reportUtils";
import { printReport } from "../utils/printReport";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/common/SearchBar";
import DataTable from "../components/common/DataTable";
import Button from "../components/ui/Button";
import ReportCard from "../components/reports/ReportCard";

import {
  FiPrinter,
  FiDownload,
} from "react-icons/fi";

import {
  reportConfigs,
  type ReportType,
} from "../config/reportConfigs";

import styles from "./ReportsPage.module.css";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] =
    useState<ReportType>("inventory");

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const config = reportConfigs[selectedReport];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const data = await config.loader();

        setRows(data);
      } catch (error) {
        console.error(error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [config]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;

    return rows.filter((row) =>
      JSON.stringify(row)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [rows, search]);

  function handleExport() {
    const today = new Date().toISOString().split("T")[0];

    exportToCsv(
      `${config.title.replace(/\s+/g, "_")}_${today}.csv`,
      filteredRows,
      config.columns
    );
  }

  function handlePrint() {
    printReport(
      config.title,
      filteredRows,
      config.columns
    );
  }

  if (loading) {
    return <p>Loading reports...</p>;
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Reports"
        subtitle="Generate and export warehouse reports"
      />

      <div className={styles.reportGrid}>
        {(Object.entries(reportConfigs) as [
          ReportType,
          typeof config
        ][]).map(([key, report]) => {
          const Icon = report.icon;

          return (
            <ReportCard
              key={key}
              title={report.title}
              description={report.description}
              icon={<Icon />}
              active={selectedReport === key}
              onClick={() => setSelectedReport(key)}
            />
          );
        })}
      </div>

      <div className={styles.toolbar}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search report..."
        />

        <div className={styles.actions}>
          <Button onClick={handlePrint}>
            <FiPrinter style={{ marginRight: 8 }} />
            Print
          </Button>

          <Button onClick={handleExport}>
            <FiDownload style={{ marginRight: 8 }} />
            Export CSV
          </Button>
        </div>
      </div>

      {config.columns.length > 0 ? (
        <DataTable
          rowKey={config.rowKey}
          data={filteredRows}
          columns={config.columns}
        />
      ) : (
        <div className={styles.placeholder}>
          <h3>{config.title}</h3>

          <p>This report has loaded successfully.</p>

          <p>We only need to define its columns.</p>
        </div>
      )}
    </div>
  );
}