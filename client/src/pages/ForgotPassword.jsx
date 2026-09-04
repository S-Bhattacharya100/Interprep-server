import { useState } from "react"; 
import { Link } from "react-router-dom";
import { forgotPassword } from "../features/auth/authAPI";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess("");
        setError("");

        if(!email.trim()) {
            setError("Email is required");
            return;
        }

        try {
            setLoading(true);
            const response = await forgotPassword(email);

            setSuccess(
                response.data.message || "Password reset email has been sent successfully"
            );

            setEmail("");

        } catch (error) {

            setError(
                error.response?.data?.message || "Failed to send password reset email"
            );
        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

                {/* Heading */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-blue-600">
                        Interprep
                    </h1>

                    <h2 className="text-2xl font-bold mt-6">
                        Forgot Password?
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Enter your email address and we'll send you a
                        password reset link.
                    </p>

                </div>

                {/* Success */}

                {success && (
                    <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm">
                        {success}
                    </div>
                )}

                {/* Error */}

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}

                <form onSubmit={handleSubmit}>

                    <div className="mb-5">

                        <label
                            htmlFor="email"
                            className="block font-semibold mb-2"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"
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

export default ForgotPassword;