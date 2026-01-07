"use client"
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function Profile() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({})
  useEffect(() => {
    const token = Cookies.get('token')
    const decoded = jwtDecode(token);
    setUser(decoded)
  }, [])
  function logout() {
    Cookies.remove("token");
    location.href = "/";
  }
  return (
    <Popover>
        <PopoverTrigger>
          <Avatar className={"avatar-border"}> 
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent>
          <p className="p-1">{user?.name}</p>
          <p className="p-1">{user?.email}</p>
          <p className="p-1">
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
                    <Button onClick={logout} >
                      Log Out
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </p>
        </PopoverContent>
      </Popover>
  )
}

export default Profile