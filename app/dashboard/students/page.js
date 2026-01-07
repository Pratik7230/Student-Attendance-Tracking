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
    <div className='p-7'>
        <h2 className='font-bold text-2xl flex 
        justify-between items-center'>Students
        <AddNewStudent refreshData={GetAllStudents}/>
        </h2>
        <StudentListTable studentList={studentList}
        refreshData={GetAllStudents}/>
    </div>
    
  )
}

export default Student