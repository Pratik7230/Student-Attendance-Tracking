"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import GlobalApi from "@/app/_services/GlobalApi";
import { toast } from "react-toastify";
import AnimatedSpin from "@/app/_components/AnimatedSpin";
import { KeyRound } from "lucide-react";

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

  function logout(){
    Cookies.remove("token");
    location.href = "/";
  }

  const handleChangePassword = async (data) => {
    setLoading(true);
    try {
      await GlobalApi.ChangePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success("Password changed successfully!");
      reset();
      setChangePasswordOpen(false);
    } catch (error) {
      const errorMessage = error?.response?.data?.error || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-10">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Settings</h2>

      <div className="space-y-4">
        {/* Change Password Section */}
        <div className="p-3 md:p-5 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="text-lg font-semibold">Change Password</h3>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
            </div>
            <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Change Password</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new password.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <Input
                      disabled={loading}
                      type="password"
                      {...register("currentPassword", { required: "Current password is required" })}
                      className="w-full"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <Input
                      disabled={loading}
                      type="password"
                      {...register("newPassword", { 
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })}
                      className="w-full"
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <Input
                      disabled={loading}
                      type="password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === watch("newPassword") || "Passwords do not match"
                      })}
                      className="w-full"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        reset();
                        setChangePasswordOpen(false);
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      <AnimatedSpin loading={loading}>
                        Change Password
                      </AnimatedSpin>
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-3 md:p-5 flex justify-end">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" onClick={() => setOpen(true)}>Log out</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. You will be logged out and your session
                  will end.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button onClick={logout}>
                    Log Out
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
