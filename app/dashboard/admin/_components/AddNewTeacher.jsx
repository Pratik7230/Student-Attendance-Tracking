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
                <DialogContent className="max-w-[95vw] md:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg md:text-xl">Add New Teacher</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
                                <div className="py-1 md:py-2">
                                    <label className="text-sm md:text-base block mb-1">Full Name</label>
                                    <Input placeholder="Ex. John Doe" {...register("name", { required: true })} className="text-sm md:text-base" />
                                </div>

                                <div className="py-1 md:py-2">
                                    <label className="text-sm md:text-base block mb-1">Email</label>
                                    <Input type="email" placeholder="Ex. example@gmail.com" {...register("email", { required: true })} className="text-sm md:text-base" />
                                    {errors.email && <p className="text-red-500 text-xs md:text-sm mt-1">Valid email is required.</p>}
                                </div>

                                <div className="py-1 md:py-2">
                                    <label className="text-sm md:text-base block mb-1">Select Subjects</label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between text-sm md:text-base">
                                                {selectedSubjects.length === 0 ? "Select subjects" : `${selectedSubjects.length} subjects selected`}
                                                <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                                            {subjects.map((subject) => (
                                                <DropdownMenuCheckboxItem
                                                    key={subject.id}
                                                    checked={selectedSubjects.includes(subject.id)}
                                                    onCheckedChange={() => toggleSubjectSelection(subject.id)}
                                                    className="text-sm md:text-base"
                                                >
                                                    {subject.name}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {selectedSubjects.length === 0 && (
                                        <p className="text-red-500 text-xs md:text-sm mt-1">Please select at least one subject.</p>
                                    )}
                                </div>

                                <div className="py-1 md:py-2">
                                    <label className="text-sm md:text-base block mb-1">Contact Number</label>
                                    <Input type="number" placeholder="Ex. 9876543210" {...register("contact")} className="text-sm md:text-base" />
                                </div>

                                <div className="py-1 md:py-2">
                                    <label className="text-sm md:text-base block mb-1">Address</label>
                                    <Input placeholder="525, Address..." {...register("address")} className="text-sm md:text-base" />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center justify-end mt-4 md:mt-5">
                                    <Button type="button" onClick={() => setOpen(false)} variant="ghost" className="w-full sm:w-auto text-sm md:text-base">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading} className="w-full sm:w-auto text-sm md:text-base">
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
