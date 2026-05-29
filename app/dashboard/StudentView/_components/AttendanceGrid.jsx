//app/dashboard/attendance/_componets/AttendanceGrid.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import moment from 'moment';
import { getUniqueRecord } from '@/app/_services/service';

const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 75, 100];

function AttendanceGrid({ attendanceList, selectedMonth, subjectId }) {
  const [isMobile, setIsMobile] = useState(false);
  const [rowData, setRowData] = useState();

  // Detect screen size for responsive pagination
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const [colDefs, setColDefs] = useState([
    { field: 'studentId' },
    { field: 'name' },
  ]);

  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const daysArrays = useMemo(() => {
    const numberOfDays = daysInMonth(
      moment(selectedMonth).format('yyyy'),
      moment(selectedMonth).format('MM')
    );
    return Array.from({ length: numberOfDays }, (_, i) => i + 1);
  }, [selectedMonth]);

  const isPresent = useCallback(
    (studentId, day) =>
      attendanceList?.some(
        (item) => item.day == day && item.studentId == studentId
      ) ?? false,
    [attendanceList]
  );

  useEffect(() => {
    if (attendanceList) {
      const uniqueStudents = getUniqueRecord(attendanceList);

      const dynamicCols = daysArrays.map((date) => ({
        field: date.toString(),
        width: 50,
        editable: false,
      }));

      setColDefs([
        { field: 'studentId', headerName: 'Student ID' },
        { field: 'name', headerName: 'Name' },
        ...dynamicCols,
      ]);

      uniqueStudents.forEach((obj) => {
        daysArrays.forEach((date) => {
          obj[date] = isPresent(obj.studentId, date);
        });
      });

      setRowData(uniqueStudents);
    }
  }, [attendanceList, daysArrays, isPresent]);

  return (
    <div>
      <div
        className="ag-theme-quartz w-full overflow-auto"
        style={{
          height: 'calc(100vh - 300px)',
          minHeight: 400,
          maxHeight: 600,
        }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          pagination={!isMobile}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
        />
      </div>
    </div>
  );
}

export default AttendanceGrid;
