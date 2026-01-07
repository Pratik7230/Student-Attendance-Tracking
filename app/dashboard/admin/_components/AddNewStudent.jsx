"use client";
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';

function AddNewStudent({ refreshData }) {
    const [open, setOpen] = useState(false);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        GetAllGradesList();
    }, []);

    const GetAllGradesList = () => {
        GlobalApi.GetAllGrades().then(resp => {
            setGrades(resp.data);
        });
    };

    const onSubmit = async (data) => {
        setLoading(true);
    
        try {
            console.log("Submitting Student Data:", data);
            
            // Step 1: Add student to the student table
            const studentResp = await GlobalApi.CreateNewStudent(data);
            console.log("Student API Response:", studentResp);
    
            if (studentResp.data) {
                toast('New Student Added Successfully!');
                reset();
                setOpen(false);
                refreshData();
            }
        } catch (error) {
            console.error("Error Response:", error?.response?.data || error);
            toast("Failed to add student. Please try again.", { type: "error" });
        }
    
        setLoading(false);
    };
    
    

    return (
        <div>
            <Button onClick={() => setOpen(true)}>+ Add New Student</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[95vw] md:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg md:text-xl">Add New Student</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
                                <div className='py-1 md:py-2'>
                                    <label className="text-sm md:text-base block mb-1">Full Name</label>
                                    <Input placeholder='Ex. Pratik Patil'
                                        {...register('name', { required: true })}
                                        className="text-sm md:text-base"
                                    />
                                </div>

                                <div className='py-1 md:py-2'>
                                    <label className="text-sm md:text-base block mb-1">Email</label>
                                    <Input type="email" placeholder='Ex. example@gmail.com'
                                        {...register('email', { required: true })}
                                        className="text-sm md:text-base"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs md:text-sm mt-1">Valid email is required.</p>}
                                </div>

                                <div className='flex flex-col py-1 md:py-2'>
                                    <label className="text-sm md:text-base block mb-1">Select Grade</label>
                                    <select className='p-2 md:p-3 border rounded-lg text-sm md:text-base'
                                        {...register('gradeId', { required: true })}>
                                        {grades.map((item, index) => (
                                            <option key={index} value={item.id}>{item.grade}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='py-1 md:py-2'>
                                    <label className="text-sm md:text-base block mb-1">Contact Number</label>
                                    <Input type="number" placeholder='Ex. 9876543210'
                                        {...register('contact')}
                                        className="text-sm md:text-base"
                                    />
                                </div>

                                <div className='py-1 md:py-2'>
                                    <label className="text-sm md:text-base block mb-1">Address</label>
                                    <Input placeholder='525, Address...'
                                        {...register('address')}
                                        className="text-sm md:text-base"
                                    />
                                </div>

                                <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center justify-end mt-4 md:mt-5'>
                                    <Button type="button" onClick={() => setOpen(false)} variant="ghost" className="w-full sm:w-auto text-sm md:text-base">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading} className="w-full sm:w-auto text-sm md:text-base">
                                        {loading ? <LoaderIcon className='animate-spin' /> : 'Save'}
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

export default AddNewStudent;
