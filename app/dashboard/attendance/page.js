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
    <div className="p-10">
      <h2 className="text-2xl font-bold">Attendance</h2>

      {/* Search Options */}
      <div className="flex gap-5 my-5 p-5 border rounded-lg shadow-sm">
        <div className="flex gap-2 items-center">
          <label>Select Month:</label>
          <MonthSelection selectedMonth={(value) => setSelectedMonth(value)} />
        </div>

        <div className="flex gap-2 items-center">
          <label>Select Subject:</label>
          <TeacherSubjectSelect selectedSubjectId={(v) => setSelectedSubjectId(v)} /> {/* ✅ Fix: Correct function */}
        </div>


        <div className="flex gap-2 items-center">
          <label>Select Grade:</label>
          <GradeSelect selectedSubjectId={selectedSubjectId} selectedGrade={(v) => setSelectedGradeId(v)} />
        </div>

       
        <Button onClick={onSearchHandler}>Search</Button>
      </div>

      {/* Student Attendance Grid */}
      <AttendanceGrid attendanceList={attendanceList} selectedMonth={selectedMonth} subjectId={selectedSubjectId} selectedGradeId={selectedGradeId}/>
      <div><h2 className="text-red-500">*Sundays are skipped</h2></div>

    </div>
  );
}

export default Attendance;