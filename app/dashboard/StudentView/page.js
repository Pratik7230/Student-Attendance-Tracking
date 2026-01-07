"use client";
import GradeSelect from "@/app/_components/GradeSelect";
import MonthSelection from "@/app/_components/MonthSelection";
import GlobalApi from "@/app/_services/GlobalApi";
import { Button } from "@/components/ui/button";
import moment from "moment";
import React, { useState } from "react";
import AttendanceGrid from "./_components/AttendanceGrid";
import StudentSubjectSelect from "@/app/_components/StudentSubjectSelect";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedSubjectId, setSelectedSubjectId] = useState(); // ✅ Fix: Added state for subject
  const [attendanceList, setAttendanceList] = useState();
//.....
  // Fetch attendance list for given month, grade, and subject
  const onSearchHandler = () => {
    const token = Cookies.get("token")
    const { id } = jwtDecode(token)
    const month = moment(selectedMonth).format("MM/YYYY");
    GlobalApi.GetStudentAttendanceList(id, month, selectedSubjectId).then((resp) => {
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
          <StudentSubjectSelect selectedSubjectId={(v) => setSelectedSubjectId(v)} /> {/* ✅ Fix: Correct function */}
        </div>

        <Button onClick={onSearchHandler}>Search</Button>
      </div>

      <AttendanceGrid attendanceList={attendanceList} selectedMonth={selectedMonth} />
    </div>
  );
}

export default Attendance;