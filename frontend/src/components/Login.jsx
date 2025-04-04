import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle, FaUserShield, FaStore } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import getBaseUrl from '../utils/baseURL';

const Login = () => {
    const [message, setMessage] = useState("")
    const { loginUser, signInWithGoogle } = useAuth();
    const navigate = useNavigate()
    const [role, setRole] = useState('user')
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        try {
            if (role === 'user') {
                await loginUser(data.email, data.password);
                navigate("/")
            } else {
                const endpoint = role === 'admin' ? 'admin' : 'seller';
                const response = await axios.post(`${getBaseUrl()}/api/auth/${endpoint}`, {
                    username: data.email,
                    password: data.password
                });
                
                const tokenKey = role === 'admin' ? 'adminToken' : 'sellerToken';
                localStorage.setItem(tokenKey, response.data.token);
                
                const redirectPath = role === 'admin' ? '/dashboard' : '/seller-dashboard';
                navigate(redirectPath);
            }
            alert("Login successful!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Invalid credentials")
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

                <div className="flex justify-center space-x-4 mb-6">
                    {[
                        { id: 'user', label: 'User', icon: FaGoogle },
                        { id: 'seller', label: 'Seller', icon: FaStore },
                        { id: 'admin', label: 'Admin', icon: FaUserShield }
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setRole(id)}
                            className={`flex items-center px-4 py-2 rounded-lg ${
                                role === id 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Icon className="mr-2" />
                            {label}
                        </button>
                    ))}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label className="sr-only">{role === 'user' ? 'Email' : 'Username'}</label>
                            <input
                                {...register("email", { required: true })}
                                type={role === 'user' ? 'email' : 'text'}
                                placeholder={role === 'user' ? 'Email Address' : 'Username'}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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

                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>

                    {role === 'user' && (
                        <button
                            onClick={handleGoogleSignIn}
                            type="button"
                            className="w-full flex items-center justify-center gap-2 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <FaGoogle className="text-xl text-blue-600" />
                            Continue with Google
                        </button>
                    )}
                </form>

                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to={role === 'user' ? "/register" : `/register/${role}`} className="font-medium text-blue-600 hover:text-blue-500">
                        Register as {role}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login