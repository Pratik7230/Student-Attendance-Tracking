"use client";
import GradeSelect from "@/app/_components/GradeSelect";
import MonthSelection from "@/app/_components/MonthSelection";
import GlobalApi from "@/app/_services/GlobalApi";
import { Button } from "@/components/ui/button";
import moment from "moment";
import React, { useState } from "react";
import TeacherSubjectSelect from "@/app/_components/TeacherSubjectSelect";
import AnimatedSpin from "@/app/_components/AnimatedSpin";
import { Tooltip } from "recharts";

function GenerateReport() {
  const [selectedStartMonth, setSelectedStartMonth] = useState();
  const [selectedEndMonth, setSelectedEndMonth] = useState();
  const [selectedGrade, setSelectedGrade] = useState();
  const [selectedSubjectId, setSelectedSubjectId] = useState();
  const [loading, setLoading] = useState();

  // Fetch attendance list for given month, grade, and subject
  const onSearchHandler = () => {
    const from = moment(selectedStartMonth).format("MM/YYYY");
    const to = moment(selectedEndMonth).format("MM/YYYY");
    setLoading(true)
    GlobalApi.GenerateReport(selectedGrade, from, to, selectedSubjectId)
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        // Create a download link
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `Attendence_Report_${new Date().toISOString()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Cleanup
      }).finally(() => {
        setLoading(false)
      });
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">Generate Report</h2>

      <div>
        <div className="flex gap-5 my-5 p-5 border rounded-lg shadow-sm">
          <div className="flex gap-2 items-center">
            <label>Select Start Month:</label>
            <MonthSelection selectedMonth={(value) => setSelectedStartMonth(value)} />
          </div>

          <div className="flex gap-2 items-center">
            <label>Select End Month:</label>
            <MonthSelection selectedMonth={(value) => setSelectedEndMonth(value)} />
          </div>


          <div className="flex gap-2 items-center">
            <label>Select Subject:</label>
            <TeacherSubjectSelect selectedSubjectId={(v) => setSelectedSubjectId(v)} />
          </div>


          <div className="flex gap-2 items-center">
            <label>Select Grade:</label>
            <GradeSelect selectedSubjectId={selectedSubjectId} selectedGrade={(v) => setSelectedGrade(v)} />

            <AnimatedSpin loading={loading}>
            <Button disabled={!(selectedSubjectId && selectedGrade && selectedStartMonth <= selectedEndMonth)} onClick={onSearchHandler}>Generate</Button>
          </AnimatedSpin>
          </div>
          


        </div>
      </div>
    </div >
  );
}

export default GenerateReport;


