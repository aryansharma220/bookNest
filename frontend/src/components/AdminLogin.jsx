import React, { useState } from 'react'
import { useForm } from "react-hook-form"

import axios from "axios"
import getBaseUrl from '../utils/baseURL'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    const [message, setMessage] = useState("")
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()

      const navigate = useNavigate()

      const onSubmit = async (data) => {
        try {
           const response =  await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
           })
           const auth = response.data;
            if(response.status === 200) {
                localStorage.setItem('token', auth.token);
                setTimeout(() => {
                    localStorage.removeItem('token')
                    alert('Token has expired! Please login again.');
                    navigate("/")
                }, 3600 * 1000);

                alert("Admin Login successful!")
                navigate("/dashboard")
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage(error.response?.data?.message || "Connection error. Please try again.") 
        }
      }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center bg-gradient-to-br from-purple-50 to-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Portal</h2>
                    <p className="mt-2 text-sm text-gray-600">Enter your credentials to access the dashboard</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <input 
                                {...register("username", { required: true })}
                                type="text"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                {...register("password", { required: true })}
                                type="password"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {message && <p className="text-red-500 text-sm text-center">{message}</p>}

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                            Access Dashboard
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin