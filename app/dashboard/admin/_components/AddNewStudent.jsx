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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='py-2'>
                                    <label>Full Name</label>
                                    <Input placeholder='Ex. Pratik Patil'
                                        {...register('name', { required: true })}
                                    />
                                </div>

                                <div className='py-2'>
                                    <label>Email</label>
                                    <Input type="email" placeholder='Ex. example@gmail.com'
                                        {...register('email', { required: true })} />
                                    {errors.email && <p className="text-red-500 text-sm">Valid email is required.</p>}
                                </div>

                                <div className='flex flex-col py-2'>
                                    <label>Select Grade</label>
                                    <select className='p-3 border rounded-lg'
                                        {...register('gradeId', { required: true })}>
                                        {grades.map((item, index) => (
                                            <option key={index} value={item.id}>{item.grade}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='py-2'>
                                    <label>Contact Number</label>
                                    <Input type="number" placeholder='Ex. 9876543210'
                                        {...register('contact')} />
                                </div>

                                <div className='py-2'>
                                    <label>Address</label>
                                    <Input placeholder='525, Address...'
                                        {...register('address')} />
                                </div>

                                <div className='flex gap-3 items-center justify-end mt-5'>
                                    <Button type="button" onClick={() => setOpen(false)} variant="ghost">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
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
