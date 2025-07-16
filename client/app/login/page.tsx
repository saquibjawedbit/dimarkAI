
"use client"

import { useAuth } from "../../context/AuthContext"
import axiosClient from "../../api/axiosClient"
import { ApiEndpoints } from "../../api/endpoints/apiConfig"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bot, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)

  // AuthContext
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await axiosClient.post(ApiEndpoints.login, {
        email: formData.email,
        password: formData.password,
      })
      const { user, accessToken } = response.data
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("accessToken", accessToken)
      setUser(user)
      window.location.href = "/dashboard"
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // Implement social login logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements (from landing page) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-indigo-400/40 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-40 left-20 w-6 h-6 bg-purple-400/20 rounded-full animate-float-fast"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-blue-500/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-5 h-5 bg-indigo-300/25 rounded-full animate-float-medium"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-500/35 rounded-full animate-float-fast"></div>
        {/* Gradient Waves */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full animate-wave-1"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full animate-wave-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-300/5 to-blue-300/5 rounded-full animate-wave-3"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] animate-grid-move"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </Link>

        <Card className="bg-white/80 border-gray-200/50 backdrop-blur-2xl shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                DiMark AI
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleSocialLogin("google")}
                variant="outline"
                className="w-full bg-white/70 border-gray-300 text-gray-700 hover:bg-white hover:shadow-md backdrop-blur-sm rounded-full py-6 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                onClick={() => handleSocialLogin("facebook")}
                variant="outline"
                className="w-full bg-white/70 border-gray-300 text-gray-700 hover:bg-white hover:shadow-md backdrop-blur-sm rounded-full py-6 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </Button>
            </div>

            <div className="relative">
              <Separator className="bg-gray-200/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 text-gray-500 text-sm">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-full py-6 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-full py-6 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-blue-600">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-gray-300 bg-white/70 text-blue-500 focus:ring-blue-400"
                  />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  className="text-blue-500 hover:text-blue-400 transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full py-6 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-blue-300/30 border-t-blue-400 rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-text">Sign In</span>
                )}
              </Button>
            </form>
            <div className="text-center text-blue-600 mt-4">
              {"Don't have an account? "}
              <Link
                href="/register"
                className="text-blue-500 hover:text-blue-400 font-semibold underline underline-offset-2 transition-colors duration-300"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
