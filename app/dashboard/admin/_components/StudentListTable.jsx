import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"
import { Button } from '@/components/ui/button';
import { Search, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';


const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 75, 100];

function StudentListTable({ studentList, refreshData }) {

  const CustomButtons = (props) => {
    return (
    <AlertDialog>
      <AlertDialogTrigger><Button variant="destructive"><Trash2 /></Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your Record
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>DeleteRecord(props?.data?.id)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    )
  }

  // const [colDefs, setColDefs] = useState([
  //   { field: "id", filter: false },
  //   { field: "name", filter: false },
  //   { field: "address", filter: false },
  //   { field: "contact", filter: false },
  //   {field: "grade",filter: false},
  //   { field: 'action', cellRenderer: CustomButtons }

  // ])

  const [colDefs, setColDefs] = useState([
    { field: "id", headerName: "ID", minWidth: 80, flex: 0.5 },
   // { field:"rollno",headerName:"Roll No", minWidth: 120, flex: 1 },
    { field: "name", headerName: "Name", minWidth: 120, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 120, flex: 2 },
    { field: "address", headerName: "Address", minWidth: 150, flex: 1 },
    { field: "contact", headerName: "Contact", minWidth: 120, flex: 1 },
    { field: "gradeId", headerName: "gradeId", minWidth: 100, flex: 1 },
    { field: "action", headerName: "Action", minWidth: 120, flex: 1, cellRenderer: CustomButtons }
  ]);
  


  const [rowData, setRowData] = useState();
  const [searchInput, setSearchInput] = useState();

  useEffect(() => {
    studentList && setRowData(studentList)
  }, [studentList])

  const DeleteRecord=(id)=>{
    GlobalApi.DeleteStudentRecord(id).then(resp=>{
      if(resp)
      {
        toast('Record deleted Successfully !')
        refreshData()
      }
    })
  }
  
  return (
    <div className='my-7'>
      <div className='ag-theme-quartz'
        style={{ height: 500 }}
      >
        <div className='p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm'>
          <Search />
          <input type='text' placeholder='Search on Anything.....'
            className='outline-none w-full'
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          pagination={pagination}
          quickFilterText={searchInput}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
        />
      </div>
    </div>
  )
}

export default StudentListTable