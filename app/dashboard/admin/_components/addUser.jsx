"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import GlobalApi from "@/app/_services/GlobalApi";

const roleMap = {
  1: "Admin",
  2: "Teacher",
  4: "Class Teacher",
  5: "HOD",
  6: "Principal",
};

function AddUser({ refreshData }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [openUserDialog, setOpenUserDialog] = React.useState(false);

  const addUser = async (data) => {
    try {
      if (!data.role) {
        toast.error("Please select a role");
        return;
      }

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: Number(data.role),
      };

      await GlobalApi.AddUser(payload);
      toast.success("User added successfully");
      setOpenUserDialog(false);
      reset();
      refreshData(); // Refresh user list
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  return (
    <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
      <DialogTrigger asChild>
        <Button>
          + Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Admin/Teacher</DialogTitle>
        <form onSubmit={handleSubmit(addUser)} className="space-y-4">
          <Input placeholder="Name" {...register("name", { required: true })} />
          <Input placeholder="Email" {...register("email", { required: true })} />
          <Input placeholder="Password" type="password" {...register("password", { required: true })} />
          <Select onValueChange={(value) => setValue("role", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleMap).map(([id, role]) => (
                <SelectItem key={id} value={id}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">Add User</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddUser;
