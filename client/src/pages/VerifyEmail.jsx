import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { verifyEmail } from "../features/auth/authAPI";
import { loginSuccess } from "../features/auth/authSlice";

const VerifyEmail = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const verificationStarted = useRef(false);

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    
    useEffect(() => {
        const verifyUserEmail = async () => {

            const token = searchParams.get("token");

            if(!token) {
                setLoading(false);
                setError("Token not found");
                return;
            }

            try {
                const response = await verifyEmail(token);
                const {
                    accessToken,
                    refreshToken,
                    user
                } = response.data;

                dispatch(
                    loginSuccess({
                        accessToken,
                        refreshToken,
                        user
                    })
                );

                setSuccess(
                    response.data.message || "Email verified successfully"
                );

                // Redirect to Dashboard
                setTimeout(() => {
                    navigate("/dashboard", {
                        replace: true
                    });
                }, 1500);

            } catch (error) {

                setError(error.response?.data?.message || "Email verification failed");

            } finally {

                setLoading(false);

            }
        }

        verifyUserEmail();
    }, [dispatch, navigate, searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 text-center">

                <h1 className="text-3xl font-bold text-blue-600 mb-6">
                    Interprep
                </h1>

                {/* Loading */}
                {loading && (
                    <>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>

                        <h2 className="text-xl font-semibold">
                            Verifying your email...
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Please wait while we verify your email address.
                        </p>
                    </>
                )}

                {/* Success */}
                {!loading && success && !error && (
                    <>
                        <div className="text-green-600 text-5xl mb-4">
                            ✓
                        </div>

                        <h2 className="text-xl font-semibold text-green-600">
                            Email Verified!
                        </h2>

                        <p className="text-gray-600 mt-2">
                            {success}
                        </p>

                        <p className="text-sm text-gray-500 mt-4">
                            Redirecting you to the dashboard...
                        </p>
                    </>
                )}

                {/* Error */}
                {!loading && error && !success && (
                    <>
                        <div className="text-red-500 text-5xl mb-4">
                            ✕
                        </div>

                        <h2 className="text-xl font-semibold text-red-600">
                            Verification Failed
                        </h2>

                        <p className="text-gray-600 mt-2">
                            {error}
                        </p>

                        <button
                            onClick={() => navigate("/resend-verification")}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                        >
                            Resend Verification Email
                        </button>

                        <div className="mt-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="text-blue-600 hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    </>
                )}

            </div>

        </div>
    );
};

export default VerifyEmail;