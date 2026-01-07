"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Eye, FileStack } from "lucide-react";
import GlobalApi from "@/app/_services/GlobalApi";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import AddNewStudent from "./_components/AddNewStudent";
import { Checkbox } from "@/components/ui/checkbox";
import BulkStudent from "./bulkStudent";
import AddNewTeacher from "./_components/AddNewTeacher";
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
import EditTeacher from "./_components/EditTeacher";

const roleMap = {
  1: "Admin",
  2: "Teacher",
  3: "Student",
  4: "ClassTeacher",
  5: "HOD",
  6: "Pricipal"
};

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [openViewDialog, setOpenViewDialog] = useState(false);


  const [openStudentDialog, setOpenStudentDialog] = useState(false);

  // const [openBulkStudentDialog, setOpenBulkStudentDialog] = useState(false);
  const [grades, setGrades] = useState([]);
  const [bulkStudents, setBulkStudents] = useState([]);
  const [students, setStudents] = useState([]); // State to store student data

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);



  const [colDefs] = useState([
    { field: "id", headerName: "ID", minWidth: 80, flex: 0.5 },
    { field: "name", headerName: "Name", minWidth: 120, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 120, flex: 2 },
    { field: "address", headerName: "Address", minWidth: 150, flex: 1 },
    { field: "contact", headerName: "Contact", minWidth: 120, flex: 1 },
    { field: "grade", headerName: "Grade", minWidth: 100, flex: 1 },
  ]);

  const [rowData, setRowData] = useState([]); // Initialize rowData as an empty array
  const [searchInput, setSearchInput] = useState();

  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [25, 50, 75, 100];

  useEffect(() => {
    fetchUsers();
    fetchGrades();
    fetchStudents(); // Fetch students data on component mount
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await GlobalApi.GetAllGrades();
      setGrades(response.data);
    } catch (error) {
      toast.error("Failed to fetch grades");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await GlobalApi.GetAllStudents();
      if (response.data) {
        const newData = response.data.map(x => {
          return {
            ...x,
            grade: grades.find(g => g.id == x.gradeId)?.grade
          }
        })
        setStudents(newData); // Set students data;
        setRowData(newData); // Set rowData for the grid
      }
    } catch (error) {
      toast.error("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await GlobalApi.GetAllSubjects();
      setSubjects(response.data); // Ensure response.data is an array of subjects
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    }
  };

  const handleCheckboxChange = (subjectId) => {
    setSelectedSubjects((prevSelected) =>
      prevSelected.includes(subjectId)
        ? prevSelected.filter((id) => id !== subjectId) // Remove if already selected
        : [...prevSelected, subjectId] // Add if not selected
    );
  };

  const fetchUsers = async () => {
    try {
      const response = await GlobalApi.GetUsers();
      if (response.data) {
        setUsers(
          response.data.map((user) => ({
            ...user,
            role: roleMap[user.role_id] || "Unknown",
          }))
        );
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const addUser = async (data) => {
    try {
      console.log("Form Data:", data); // Debugging log

      if (!data.role) {
        toast.error("Please select a role");
        return;
      }

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: Number(data.role),
        subjects: selectedSubjects,
      };

      console.log("Payload:", payload); // Debugging log

      const response = await GlobalApi.AddUser(payload);
      console.log("API Response:", response);

      toast.success("User added successfully");
      setOpenUserDialog(false);
      reset();
      setSelectedSubjects([]);
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add user");
    }
  };

  const deleteUser = (id) => {
    GlobalApi.DeleteUser(id).then(resp => {
      if (resp) {
        toast('User deleted Successfully !')
        fetchUsers()
      } else {
        toast("something error")
      }
    })
  }

  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    GetAllStudents();
  }, [])

  const GetAllStudents = () => {
    GlobalApi.GetAllStudents().then(resp => {
      setStudentList(resp.data);
    })
  }


  return (
    <div className="p-3 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Admin Panel</h1>

      <div className="flex flex-wrap gap-2 md:gap-4 mb-3 md:mb-4">
        <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] md:max-w-md">
            <DialogTitle>Add Admin/Teacher</DialogTitle>
            <form onSubmit={handleSubmit(addUser)} className="space-y-3 md:space-y-4">
              <Input placeholder="Name" {...register("name", { required: true })} className="text-sm md:text-base" />
              <Input placeholder="Email" {...register("email", { required: true })} className="text-sm md:text-base" />
              <Input placeholder="Password" type="password" {...register("password", { required: true })} className="text-sm md:text-base" />
              <Select onValueChange={(value) => setValue("role", value)}>
                <SelectTrigger className="w-full text-sm md:text-base">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Admin</SelectItem>
                  {/* <SelectItem value="2">Teacher</SelectItem> */}
                  <SelectItem value="4">Class Teacher</SelectItem>
                  <SelectItem value="5">HOD</SelectItem>
                  <SelectItem value="6">Principal</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full text-sm md:text-base">Add User</Button>
            </form>
          </DialogContent>
        </Dialog>

        <div>
          <AddNewTeacher refreshData={fetchUsers}/>
        </div>


        <div>
          {/* Add Student Dialog */}
          <AddNewStudent refreshData={fetchUsers} />

        </div>

        <div>

          {/* View Students Dialog */}
          <Button
            onClick={() => {
              fetchStudents(); // ✅ Refresh data before opening dialog
              setOpenViewDialog(true);
            }}
          >
            <Eye className="w-4 h-4" /> View Students
          </Button>
          <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
            <DialogContent className="max-w-[95vw] md:max-w-4xl h-[80vh] md:h-[500px]">
              <DialogTitle>View Students</DialogTitle>
              <div className="ag-theme-quartz w-full overflow-auto" style={{ height: 'calc(80vh - 100px)', minHeight: 300 }}>
                <AgGridReact
                  rowData={rowData} // Pass rowData to the grid
                  columnDefs={colDefs}
                  pagination={pagination}
                  quickFilterText={searchInput}
                  paginationPageSize={paginationPageSize}
                  paginationPageSizeSelector={paginationPageSizeSelector}
                />
              </div>
            </DialogContent>
          </Dialog>

        </div>

        <div>
          <BulkStudent refreshData={fetchStudents} />
        </div>

      </div>
      {/* Data Table */}
      <div className="ag-theme-quartz w-full overflow-auto" style={{ height: 'calc(100vh - 250px)', minHeight: 400, maxHeight: 600 }}>
        <AgGridReact
          rowData={users}
          columnDefs={[
            { field: "id", headerName: "ID", minWidth: 80, flex: 0.1 },
            { field: "name", headerName: "Name", minWidth: 200, flex: 0.5 },
            { field: "email", headerName: "Email", minWidth: 200, flex: 0.5 },
            { field: "role", headerName: "Role", minWidth: 120, flex: 0.5 },
            {
              field: "actions",
              headerName: "Actions",
              cellRenderer: (params) => (

                <div> 
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
                        <AlertDialogAction onClick={() => deleteUser(params.data.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {params.data.role_id == 2 ? <EditTeacher key={params.data.id} teacher={params.data} refreshData={fetchUsers}/> : <></>}
                </div>

              ),
            },
          ]}
          pagination
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}

export default AdminPage;
