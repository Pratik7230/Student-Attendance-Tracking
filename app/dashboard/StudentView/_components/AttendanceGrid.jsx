//app/dashboard/attendance/_componets/AttendanceGrid.jsx
import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"
import moment from 'moment';
import { getUniqueRecord } from '@/app/_services/service';

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 75, 100];

function AttendanceGrid({ attendanceList, selectedMonth, subjectId }) {

  const [rowData, setRowData] = useState();
  const [colDefs, setColDefs] = useState([
    { field: 'studentId' },
    { field: 'name' }
  ]);

  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const numberOfDays = daysInMonth(moment(selectedMonth).format('yyyy'), moment(selectedMonth).format('MM'));
  const daysArrays = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  useEffect(() => {
    if (attendanceList) {
      const uniqueStudents = getUniqueRecord(attendanceList);

      const dynamicCols = daysArrays.map((date) => ({
        field: date.toString(),
        width: 50,
        editable: false,
      }));

      setColDefs([
        { field: "studentId", headerName: "Student ID" },
        { field: "name", headerName: "Name" },
        ...dynamicCols,
      ]);

      uniqueStudents.forEach((obj) => {
        daysArrays.forEach((date) => {
          obj[date] = isPresent(obj.studentId, date);
        });
      });

      setRowData(uniqueStudents);
    }
  }, [attendanceList, selectedMonth, subjectId]);


  /**
   * use to check user is present or not
   * @param {*} studentId 
   * @param {*} day 
   * @returns 
   */
  const isPresent = (studentId, day) => {
    const result = attendanceList.find(item => item.day == day && item.studentId == studentId)
    return result ? true : false
  }


  return (
    <div>
      <div
        className='ag-theme-quartz w-full overflow-auto'
        style={{ height: 'calc(100vh - 300px)', minHeight: 400, maxHeight: 600 }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
        />
      </div>
    </div>
  )
}

export default AttendanceGrid
