import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../features/auth/authAPI";

const ResetPassword = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    // Handle submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess("");
        setError("");

        // Frontend validations
        if (!token) {
            setError("Token not found or invalid token");
            return;
        }

        if (!formData.password) {
            setError("Password required");
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Password do not match");
        }

        try {
            setLoading(true);

            const response = await resetPassword(
                token,
                formData.password
            );

            setSuccess(
                response.data.message || "Password reset successfull"
            );

            // Clear form
            setFormData("");
            setFormData("");

            // Redirect to the Login
            setTimeout(() => {
                navigate("/login", {
                    replace: true
                });
            }, 1500);

        } catch (error) {

            setError(
                error.response?.data?.message || "Password reset unsuccessfull"
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

                {/* Header */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-blue-600">
                        Interprep
                    </h1>

                    <h2 className="text-2xl font-bold mt-6">
                        Reset Password
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Enter your new password below.
                    </p>

                </div>

                {/* Success message */}

                {success && (
                    <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm">
                        {success}
                        <p className="mt-1">
                            Redirecting you to login...
                        </p>
                    </div>
                )}

                {/* Error message */}

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}

                <form onSubmit={handleSubmit}>

                    {/* New password */}

                    <div className="mb-5">

                        <label
                            htmlFor="password"
                            className="block font-semibold mb-2"
                        >
                            New Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your new password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={!token || loading}
                            className="w-full border border-gray-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />

                    </div>

                    {/* Confirm password */}

                    <div className="mb-6">

                        <label
                            htmlFor="confirmPassword"
                            className="block font-semibold mb-2"
                        >
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Enter your password again"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={!token || loading}
                            className="w-full border border-gray-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />

                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"
                        }
                    </button>

                </form>

                {/* Back to login */}

                <div className="text-center mt-6">

                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Back to Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;