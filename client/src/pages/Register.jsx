import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../features/auth/authAPI";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        conformPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submit 
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading("");
        setSuccess("");
        setError("");

        // Client-side validations
        if (!formData.name.trim()) {
            return setError("Name is requird");
        }
        if (!formData.email.trim()) {
            return setError("email is requird");
        }
        if (!formData.password) {
            return setError("Password is requird");
        }
        if (formData.password !== formData.conformPassword) {
            return setError("Passwords do not match!");
        }

        try {
            setLoading(true);

            const response = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            setSuccess(response.data.message);

            // Clear form
            setFormData({
                name: "",
                email: "",
                password: "",
                conformPassword: "",
            });

        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-blue-100 to-indigo-200 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center mb-6">Interprep registration</h1>
                {success && (
                    <div className="text-center mb-3 text-green-600">
                        {success}

                        <p className="text-center">
                            Didn't receive the email?

                            <Link to={"/resend-verification"} className="text-blue-600">
                                {" Click here"}
                            </Link>
                        </p>
                    </div>
                )}

                {error && (
                    <div className="text-center mb-3 text-red-600" >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2 font-medium">Name</label>

                        <input type="text" name="name" placeholder="Enter your name" className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Email</label>

                        <input type="email" name="email" placeholder="Enter your email" className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Password</label>

                        <input type="password" name="password" placeholder="Enter your password" className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Conform password</label>

                        <input type="password" name="conformPassword" placeholder="Enter your password again" className="w-full border outline-none rounded-lg p-3 focus:ring-2 focus:ring-blue-500" value={formData.conformPassword} onChange={handleChange} required />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">{loading ? "Regestering..." : "Register"}</button>
                </form>

                <p className="text-center mt-5 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;