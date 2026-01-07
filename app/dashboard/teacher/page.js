"use client"
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedMonth && selectedSubjectId && selectedGradeId) {
      GetTotalPresentCountByDay();
      getStudentAttendance();
    }
  }, [selectedMonth, selectedGradeId, selectedSubjectId])

  useEffect(()=>{
    setSelectedMonth(new Date())
  },[])

  const getStudentAttendance = () => {
    setLoading(true)
    GlobalApi.GetAttendanceList(selectedGradeId, moment(selectedMonth).format('MM/yyyy'))
      .then(resp => {
        setAttendanceList(resp.data);
      }).finally(() => {
        setLoading(false)
      })
  }

  const GetTotalPresentCountByDay = () => {
    setLoading(true)
    GlobalApi.TotalPresentCountByDay(moment(selectedMonth).format('MM/yyyy'), selectedGradeId,selectedSubjectId)
      .then(resp => {
        setTotalPresentData(resp.data);
      }).finally(() => {
        setLoading(false)
      })
  }


  return (
    <div className='p-10'>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-2xl'>Dashboard</h2>
        <div className='flex items-center gap-4'>
          <MonthSelection selectedMonth={setSelectedMonth} />
          <TeacherSubjectSelect selectedSubjectId={setSelectedSubjectId} />
          <GradeSelect selectedSubjectId={selectedSubjectId} selectedGrade={setSelectedGradeId} />
        </div>
      </div>
      {
        loading ?
          <Skeleton className="w-[100%] h-[60px] m-2"></Skeleton>
          :
          <StatusList attendanceList={attendanceList} />
      }

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className='md:col-span-2'>
          {
            loading ?
              <Skeleton className="w-[100%] h-[300px]  m-2"></Skeleton>
              : <BarChartComponent attendanceList={attendanceList}
                totalPresentData={totalPresentData} />
          }

        </div>
        <div>
          {
            loading ?
              <Skeleton className="w-[100%] h-[300px] m-2"></Skeleton>
              : <PieChartComponent attendanceList={attendanceList} />
          }

        </div>
      </div>
    </div>
  )
}

export default Dashboard
