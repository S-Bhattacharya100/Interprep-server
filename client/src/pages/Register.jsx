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
        if(!formData.name.trim()) {
            return setError("Name is requird");
        }
        if(!formData.email.trim()) {
            return setError("email is requird");
        }
        if(!formData.password) {
            return setError("Password is requird");
        }
        if(formData.password !== formData.conformPassword) {
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
        <div>
            <h2>Interprep registration</h2>
            {success && (
                <div>
                    {success}
                    <br />
                    <br />

                    Please verify your email before logging in

                    <br />
                    <br />

                    Didn't receive the email?

                    <Link to={"/resend-verification"}>
                        {"Click here"}
                    </Link>
                </div>
            )}

            {error && (
                <div>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>

                    <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Email</label>

                    <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <label>Password</label>

                    <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                </div>
                <div>
                    <label>Conform password</label>

                    <input type="password" name="conformPassword" placeholder="Enter your password again" value={formData.conformPassword} onChange={handleChange} />
                </div>

                <button disabled={loading}>{loading ? "Regestering..." : "Register"}</button>
            </form>

            <p>
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Register;