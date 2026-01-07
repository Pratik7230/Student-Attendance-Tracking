"use client";
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, LoaderIcon } from "lucide-react";
import GlobalApi from "@/app/_services/GlobalApi";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AnimatedSpin from "@/app/_components/AnimatedSpin";

function EditTeacher({ teacher, refreshData }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    useEffect(() => {
        if (open) {
            fetchSubjects();
        }
    }, [open]);

    useEffect(() => {
        if (open && subjects.length > 0 && teacher?.email) {
            setLoading(true)
            GlobalApi.GetTeacherSubjects(0, teacher?.email)
                .then(x => {
                    setSelectedSubjects(x.data.map(y => y.id))
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [teacher, open, subjects]);

    const fetchSubjects = async () => {
        try {
            setLoading(true)
            const resp = await GlobalApi.GetAllSubjects();
            setSubjects(resp.data);
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
        }finally{
            setLoading(false)
        }
    };

    const toggleSubjectSelection = (subjectId) => {
        setSelectedSubjects((prev) =>
            prev.includes(subjectId)
                ? prev.filter((id) => id !== subjectId)
                : [...prev, subjectId]
        );
    };

    const onSubmit = async () => {
        if (selectedSubjects.length === 0) {
            toast.error("Please select at least one subject.");
            return;
        }

        setLoading(true);
        try {
            const resp = await GlobalApi.UpdateTeacherSubjects(teacher.id, selectedSubjects);
            if (resp.status === 200) {
                toast.success("Subjects updated successfully!");
                setOpen(false);
                refreshData();
            } else {
                toast.error("Failed to update subjects.");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                Edit Subjects
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Teacher Subjects</DialogTitle>
                        <DialogDescription>
                            {teacher?.name && (
                                <p className="text-muted-foreground mb-2">Name: {teacher.name}</p>
                            )}
                            <div className="py-2">
                                <label>Select Subjects</label>
                                <AnimatedSpin loading={loading}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                {selectedSubjects.length === 0
                                                    ? "Select subjects"
                                                    : `${selectedSubjects.length} selected`}
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
                                </AnimatedSpin>
                            </div>

                            <div className="flex justify-end gap-3 mt-5">
                                <Button variant="ghost" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={onSubmit} disabled={loading || selectedSubjects.length == 0}>
                                    {loading ? <LoaderIcon className="animate-spin" /> : "Update"}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default EditTeacher;
