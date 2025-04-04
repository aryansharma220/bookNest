import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [message, setMessage] = useState("")
    const { loginUser, signInWithGoogle } = useAuth();
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        try {
            await loginUser(data.email, data.password);
            alert("Login successful!");
            navigate("/")
        } catch (error) {
            setMessage("Please provide a valid email and password")
            console.error(error)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            alert("Login successful!");
            navigate("/")
        } catch (error) {
            alert("Google sign in failed!")
            console.error(error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back!</h2>
                    <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label className="sr-only" htmlFor="email">Email</label>
                            <input
                                {...register("email", { required: true })}
                                type="email"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="sr-only" htmlFor="password">Password</label>
                            <input
                                {...register("password", { required: true })}
                                type="password"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {message && <p className="text-red-500 text-sm text-center">{message}</p>}

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Sign in
                        </button>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="w-full flex items-center justify-center gap-2 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <FaGoogle className="text-xl text-blue-600" />
                        Continue with Google
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login