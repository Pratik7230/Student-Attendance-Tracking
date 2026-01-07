import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import moment from 'moment';
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';
import { getUniqueRecord } from '@/app/_services/service';

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 75, 100];

function AttendanceGrid({ attendanceList, selectedMonth, subjectId, selectedGradeId }) {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  const numberOfDays = useMemo(() => {
    const year = moment(selectedMonth).format('YYYY');
    const month = moment(selectedMonth).format('MM');
    return new Date(year, month, 0).getDate();
  }, []);

  const daysArray = useMemo(() => 
    Array.from({ length: numberOfDays }, (_, i) => i + 1)
      .filter(day => new Date(moment(selectedMonth).format('YYYY'), moment(selectedMonth).format('MM') - 1, day).getDay() !== 0), 
    [numberOfDays, selectedMonth]
  );

  useEffect(() => {
    if (!attendanceList?.length) return;

    const todayDate = new Date().getDate();
    const todayYear = moment(new Date()).format('YYYY');
    const todayMonth = moment(new Date()).format('MM');

    const selectedYear = moment(selectedMonth).format('YYYY');
    const selectedMonthNumber = moment(selectedMonth).format('MM');

    const uniqueStudents = getUniqueRecord(attendanceList);

    const dynamicCols = daysArray.map((date) => ({
      field: date.toString(),
      width: 50,
      editable: !!subjectId && (todayDate == date && todayYear == selectedYear && todayMonth==selectedMonthNumber),
    }));

    setColDefs([
      { field: "studentId", headerName: "Student ID" },
      { field: "name", headerName: "Name" },
      ...dynamicCols,
    ]);

    const enrichedStudents = uniqueStudents.map((student) => {
      const studentData = { ...student };
      daysArray.forEach((day) => {
        studentData[day] = isPresent(student.studentId, day);
      });
      return studentData;
    });

    setRowData(enrichedStudents);
  }, [attendanceList, daysArray, subjectId]);

  const isPresent = (studentId, day) =>
    attendanceList.some(item => item.day === day && item.studentId === studentId);

  const onMarkAttendance = (day, studentId, presentStatus) => {
    const date = moment(selectedMonth).format('MM/YYYY');

    if (presentStatus) {
      const data = {
        day,
        studentId,
        present: true,
        date,
        subjectId,
        gradeId: selectedGradeId,
      };
      GlobalApi.MarkAttendance(data).then(() => {
        toast(`Student ID: ${studentId} marked as Present`);
      });
    } else {
      GlobalApi.MarkAbsent(studentId, day, date, subjectId,selectedGradeId).then(() => {
        toast(`Student ID: ${studentId} marked as Absent`);
      });
    }
  };

  return (
    <div className='ag-theme-quartz w-full overflow-auto' style={{ height: 'calc(100vh - 300px)', minHeight: 400, maxHeight: 600 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        onCellValueChanged={({ colDef, data, newValue }) =>
          onMarkAttendance(Number(colDef.field), data.studentId, newValue)
        }
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
      />
    </div>
  );
}

export default AttendanceGrid;
