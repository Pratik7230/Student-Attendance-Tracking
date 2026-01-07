"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import GlobalApi from "@/app/_services/GlobalApi";
import { toast } from "sonner";
import { LoaderIcon, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AddNewTeacher({ refreshData }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const resp = await GlobalApi.GetAllSubjects();
            setSubjects(resp.data);
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
        }
    };

    const toggleSubjectSelection = (subjectId) => {
        setSelectedSubjects((prev) =>
            prev.includes(subjectId)
                ? prev.filter((id) => id !== subjectId)
                : [...prev, subjectId]
        );
    };

    const onSubmit = async (data) => {
        if (selectedSubjects.length === 0) {
            toast.error("Please select at least one subject.");
            return;
        }

        setLoading(true);

        try {
            // First, add user
            const userResp = await GlobalApi.CreateNewTeacher({
                name: data.name,
                email: data.email,
                address:data.address,
                contact:data.contact,
                role_id: 2,
                password: "Teacher#1234",
                selectedSubjects
            });
           
            if (userResp.status == 201) {
                toast.success("New Teacher Added Successfully!");
                    reset();
                    setOpen(false);
                    setSelectedSubjects([]);
                    refreshData();
            } else {
                toast.error("Failed to add teacher.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to add teacher. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div>
            <Button onClick={() => setOpen(true)}>+ Add New Teacher</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Teacher</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="py-2">
                                    <label>Full Name</label>
                                    <Input placeholder="Ex. John Doe" {...register("name", { required: true })} />
                                </div>

                                <div className="py-2">
                                    <label>Email</label>
                                    <Input type="email" placeholder="Ex. example@gmail.com" {...register("email", { required: true })} />
                                    {errors.email && <p className="text-red-500 text-sm">Valid email is required.</p>}
                                </div>

                                <div className="py-2">
                                    <label>Select Subjects</label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                {selectedSubjects.length === 0 ? "Select subjects" : `${selectedSubjects.length} subjects selected`}
                                                <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full">
                                            {subjects.map((subject) => (
                                                <DropdownMenuCheckboxItem
                                                    key={subject.id}
                                                    checked={selectedSubjects.includes(subject.id)}
                                                    onCheckedChange={() => toggleSubjectSelection(subject.id)}
                                                >
                                                    {subject.name}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {selectedSubjects.length === 0 && (
                                        <p className="text-red-500 text-sm mt-1">Please select at least one subject.</p>
                                    )}
                                </div>

                                <div className="py-2">
                                    <label>Contact Number</label>
                                    <Input type="number" placeholder="Ex. 9876543210" {...register("contact")} />
                                </div>

                                <div className="py-2">
                                    <label>Address</label>
                                    <Input placeholder="525, Address..." {...register("address")} />
                                </div>

                                <div className="flex gap-3 items-center justify-end mt-5">
                                    <Button type="button" onClick={() => setOpen(false)} variant="ghost">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? <LoaderIcon className="animate-spin" /> : "Save"}
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewTeacher;
