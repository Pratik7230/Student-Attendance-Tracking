"use client";

import { useState, useEffect } from "react";
import GlobalApi from "./_services/GlobalApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AnimatedSpin from "./_components/AnimatedSpin";
import { GlobalDataService } from "./_services/globalDataService";
import { NAVIGATION_ROUTES, ROUTE_ACCESS } from "./constants";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";



export default function Home() {
  const [email, setEmail] = useState("Teacher@gmail.com");
  const [password, setPassword] = useState("Password#0411");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    // Clear previous errors
    setError("");
    
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
      .catch((err) => {
        // Check the error response status to show specific error messages
        const status = err?.response?.status;
        const errorMessage = err?.response?.data?.error;
        
        if (status === 404 || errorMessage === "User not found") {
          setError("User not found");
          toast.error("User not found");
        } else if (status === 401 || errorMessage === "Invalid credentials") {
          setError("Invalid password");
          toast.error("Invalid password");
        } else {
          setError("Invalid credentials");
          toast.error("Invalid credentials");
        }
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 relative px-4 py-8">
      {/* Theme Toggle Button */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-2 right-2 md:top-4 md:right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 z-10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
          ) : (
            <Moon className="h-4 w-4 md:h-5 md:w-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      )}

      <div className="w-full max-w-md p-4 md:p-8 space-y-4 md:space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <img
              src="/logo.svg"
              alt="Login Logo"
              className="w-40 h-16 md:w-55 md:h-24 object-contain"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <Input
              type="email"
              name="email"
              value={email}
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error when user types
              }}
              required
              className={`w-full px-3 py-2 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                error && (error === "User not found") ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {error && error === "User not found" && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <Input
              type="password"
              name="password"
              disabled={loading}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error when user types
              }}
              required
              className={`w-full px-3 py-2 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                error && (error === "Invalid password") ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {error && error === "Invalid password" && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 text-sm md:text-base rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            disabled={loading}>
            <AnimatedSpin loading={loading}>
              Login
            </AnimatedSpin>
          </Button>

          <p
            className="text-center text-sm md:text-base text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
            onClick={forgotPassword}
          >
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
}