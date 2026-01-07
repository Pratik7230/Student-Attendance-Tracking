"use client";

import { useState } from "react";
import GlobalApi from "./_services/GlobalApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AnimatedSpin from "./_components/AnimatedSpin";
import { GlobalDataService } from "./_services/globalDataService";
import { NAVIGATION_ROUTES, ROUTE_ACCESS } from "./constants";
import { toast } from "react-toastify";



export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    const obj = {
      email,
      password
    };
    setLoading(true)
    GlobalApi.Login(obj).then(resp => {
      //console.log("Login",resp.data)
      Cookies.set("token", resp.data.token, { expires: 1, secure: true });

      const role_id = GlobalDataService.getRole()
      const [firstRouteId] = ROUTE_ACCESS[role_id]
      if (!firstRouteId) {
        toast.error("You don't have any page access")
      }
      const route = NAVIGATION_ROUTES.find(x => x.id == firstRouteId)
      if (!route) {
        toast.error("You don't have any page access")
      }
      router.push(route.path)
    })
      .catch(() => {
        toast.error("Invalid Credentials")
      })
      .finally(() => {
        setLoading(false)
      })
  };

  // useEffect(() => {
  //   setEmail("saggy835+1@gmail.com")
  //   setPassword("Admin#1234")
  // }, [])

  const forgotPassword = () => {
    //toast.error("Redirecting to forgot password page...");
    router.push("forgot-password")
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <img
              src="/logo.svg"
              alt="Login Logo"
              className="w-55 h-24 object-contain"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              name="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input
              type="password"
              name="password"
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            disabled={loading}>
            <AnimatedSpin loading={loading}>
              Login
            </AnimatedSpin>
          </Button>

          <p
            className="text-center text-blue-600 cursor-pointer hover:underline"
            onClick={forgotPassword}
          >
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
}