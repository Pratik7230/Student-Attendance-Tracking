"use client"
import React, { useEffect, useState } from 'react'
import GlobalApi from '@/app/_services/GlobalApi'
import AddNewStudent from '@/app/dashboard/admin/_components/AddNewStudent';
import StudentListTable from '@/app/dashboard/admin/_components/StudentListTable';

function Student() {

  const [studentList,setStudentList]=useState([]);

  useEffect(()=>{
    GetAllStudents();
  },[])

  //use to get all students
  const GetAllStudents=()=>{
    GlobalApi.GetAllStudents().then(resp=>{
      setStudentList(resp.data);
    })
  }

  return (
    <div className='p-3 md:p-7'>
        <h2 className='font-bold text-xl md:text-2xl flex flex-col sm:flex-row
        justify-between items-start sm:items-center gap-3 mb-4'>Students
        <div className="w-full sm:w-auto">
          <AddNewStudent refreshData={GetAllStudents}/>
        </div>
        </h2>
        <div className="overflow-x-auto">
          <StudentListTable studentList={studentList}
          refreshData={GetAllStudents}/>
        </div>
    </div>
    
  )
}

export default Student