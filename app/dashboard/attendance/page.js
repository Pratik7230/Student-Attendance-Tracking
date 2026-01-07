"use client";
import GradeSelect from "@/app/_components/GradeSelect";
import MonthSelection from "@/app/_components/MonthSelection";
import GlobalApi from "@/app/_services/GlobalApi";
import { Button } from "@/components/ui/button";
import moment from "moment";
import React, { useState } from "react";
import AttendanceGrid from "./_components/AttendanceGrid";
import TeacherSubjectSelect from "@/app/_components/TeacherSubjectSelect";

function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedGradeId, setSelectedGradeId] = useState();
  const [selectedSubjectId, setSelectedSubjectId] = useState(); // ✅ Fix: Added state for subject
  const [attendanceList, setAttendanceList] = useState();

  // Fetch attendance list for given month, grade, and subject
  const onSearchHandler = () => {
    const month = moment(selectedMonth).format("MM/YYYY");
    GlobalApi.GetAttendanceList(selectedGradeId, month, selectedSubjectId).then((resp) => {
      setAttendanceList(resp.data);
    });
  };

  return (
    <div className="p-3 md:p-10">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Attendance</h2>

      {/* Search Options */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-5 my-3 md:my-5 p-3 md:p-5 border rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <label className="text-sm md:text-base whitespace-nowrap">Select Month:</label>
          <MonthSelection selectedMonth={(value) => setSelectedMonth(value)} />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <label className="text-sm md:text-base whitespace-nowrap">Select Subject:</label>
          <TeacherSubjectSelect selectedSubjectId={(v) => setSelectedSubjectId(v)} />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <label className="text-sm md:text-base whitespace-nowrap">Select Grade:</label>
          <GradeSelect selectedSubjectId={selectedSubjectId} selectedGrade={(v) => setSelectedGradeId(v)} />
        </div>

        <div className="w-full sm:w-auto">
          <Button onClick={onSearchHandler} className="w-full sm:w-auto text-sm md:text-base">Search</Button>
        </div>
      </div>

      {/* Student Attendance Grid */}
      <div className="overflow-x-auto">
        <AttendanceGrid attendanceList={attendanceList} selectedMonth={selectedMonth} subjectId={selectedSubjectId} selectedGradeId={selectedGradeId}/>
      </div>
      <div className="mt-3"><h2 className="text-sm md:text-base text-red-500">*Sundays are skipped</h2></div>

    </div>
  );
}

export default Attendance;