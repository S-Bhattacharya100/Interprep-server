import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authAPI";

import {
    loginStart,
    loginSuccess,
    loginFailure,
} from "../features/auth/authSlice";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(loginStart());

        try {
            const response = await loginUser(formData);

            const {
                accessToken,
                refreshToken,
                user,
            } = response.data;

            dispatch(loginSuccess({
                accessToken,
                refreshToken,
                user,
            }));

            navigate("/dashboard");

        } catch (err) {
            dispatch(loginFailure({
                error: err.response?.data?.message || "Login failed"
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}

                    <div>
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>

                    {/* Password */}

                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>

                    {/* Forgot password */}

                    <div className="text-right mt-2">
                        <Link
                            to="/forgot-password"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}

                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                        Login
                    </button>

                </form>

                <p className="text-center mt-5 text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;