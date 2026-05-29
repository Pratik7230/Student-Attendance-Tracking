'use client';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import MonthSelection from '../../_components/MonthSelection';
import GradeSelect from '../../_components/GradeSelect';
import GlobalApi from '../../_services/GlobalApi';
import moment from 'moment';
import StatusList from '../_components/StatusList';
import BarChartComponent from '../_components/BarChartComponent';
import PieChartComponent from '../_components/PieChartComponent';
import TeacherSubjectSelect from '@/app/_components/TeacherSubjectSelect';
import { Skeleton } from '@/components/ui/skeleton';

function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedGradeId, setSelectedGradeId] = useState();
  const [attendanceList, setAttendanceList] = useState();
  const [totalPresentData, setTotalPresentData] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMonth && selectedSubjectId && selectedGradeId) {
      GetTotalPresentCountByDay();
      getStudentAttendance();
    }
  }, [selectedMonth, selectedGradeId, selectedSubjectId]);

  useEffect(() => {
    setSelectedMonth(new Date());
  }, []);

  const getStudentAttendance = () => {
    setLoading(true);
    GlobalApi.GetAttendanceList(
      selectedGradeId,
      moment(selectedMonth).format('MM/yyyy')
    )
      .then((resp) => {
        setAttendanceList(resp.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const GetTotalPresentCountByDay = () => {
    setLoading(true);
    GlobalApi.TotalPresentCountByDay(
      moment(selectedMonth).format('MM/yyyy'),
      selectedGradeId,
      selectedSubjectId
    )
      .then((resp) => {
        setTotalPresentData(resp.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-3 md:p-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 mb-4">
        <h2 className="font-bold text-xl md:text-2xl">Dashboard</h2>
        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
          <MonthSelection selectedMonth={setSelectedMonth} />
          <TeacherSubjectSelect selectedSubjectId={setSelectedSubjectId} />
          <GradeSelect
            selectedSubjectId={selectedSubjectId}
            selectedGrade={setSelectedGradeId}
          />
        </div>
      </div>
      {loading ? (
        <Skeleton className="w-full h-[60px] mb-3 md:mb-4"></Skeleton>
      ) : (
        <StatusList attendanceList={attendanceList} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 mt-4">
        <div className="md:col-span-2">
          {loading ? (
            <Skeleton className="w-full h-[250px] md:h-[300px]"></Skeleton>
          ) : (
            <div className="overflow-x-auto">
              <BarChartComponent
                attendanceList={attendanceList}
                totalPresentData={totalPresentData}
              />
            </div>
          )}
        </div>
        <div>
          {loading ? (
            <Skeleton className="w-full h-[250px] md:h-[300px]"></Skeleton>
          ) : (
            <div className="overflow-x-auto">
              <PieChartComponent attendanceList={attendanceList} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
