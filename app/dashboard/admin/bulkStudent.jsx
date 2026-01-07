"use client";
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileStack } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import AnimatedSpin from "@/app/_components/AnimatedSpin";

function BulkStudent({ refreshData }) {
  const [openBulkStudentDialog, setOpenBulkStudentDialog] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
  
    if (!selectedFile) return;
  
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel" // .xls
    ];
  
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type. Only .xlsx and .xls files are allowed.");
      event.target.value = ""; // Clear input
      setFile(null);
      return;
    }
  
    setFile(selectedFile);
  };
  

  const uploadBulkStudents = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select an Excel file.");
      return;
    }

    // Read Excel File
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to JSON
      ///
      const students = XLSX.utils.sheet_to_json(sheet);

      // Validate required fields
      const formattedStudents = students.map((student) => ({
        name: student.Name,
        gradeId: student.GradeId,
        email: student.Email,
        address: student.Address,
        contact: student.Contact,
      }));


      console.log("formattedStudents", formattedStudents)

      try {
        setLoading(true)
        const response = await fetch("/api/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedStudents),
        });

        if (response.ok) {
          toast.success("Students uploaded successfully!");
          setOpenBulkStudentDialog(false);
          setFile(null);
          refreshData();
        } else {
          toast.error("Upload failed. Please check the file format.");
        }
      } catch (error) {
        toast.error("Error uploading students.");
        console.error("Upload Error:", error);
      } finally {
        setLoading(false)
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Dialog open={openBulkStudentDialog} onOpenChange={setOpenBulkStudentDialog}>
      <DialogTrigger asChild>
        <Button>
          <FileStack className="w-4 h-4" /> Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Bulk Student Upload</DialogTitle>
        <form onSubmit={uploadBulkStudents} className="space-y-4">
          <Input disabled={loading} type="file" accept=".xlsx, .xls" onChange={handleFileChange} required />
          <AnimatedSpin loading={loading}>
            <Button type="submit">Upload Students</Button>
          </AnimatedSpin>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default BulkStudent;
