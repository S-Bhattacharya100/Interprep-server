import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authAPI";
import { logout } from "../features/auth/authSlice";

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");

        try {
            if(refreshToken) {
                await logoutUser({
                    refreshToken
                });
            }
        } catch (error) {
            console.error (
                "Logout failed",
                error.response?.data || error.message
            );
        } finally {
            dispatch(logout());
            navigate ("/login");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Navbar */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">
                        Interprep
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto p-6">

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-3xl font-bold mb-2">
                        Welcome 👋
                    </h2>

                    <p className="text-gray-600 mb-6">
                        You have successfully logged into Interprep.
                    </p>

                    <div className="space-y-3">

                        <div>
                            <span className="font-semibold">
                                Name:
                            </span>{" "}
                            {user?.name}
                        </div>

                        <div>
                            <span className="font-semibold">
                                Email:
                            </span>{" "}
                            {user?.email}
                        </div>

                        <div>
                            <span className="font-semibold">
                                Role:
                            </span>{" "}
                            {user?.role}
                        </div>

                    </div>

                </div>

                {/* Quick Actions */}

                <div className="grid md:grid-cols-3 gap-6 mt-8">

                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-bold text-xl mb-3">
                            Problems
                        </h3>

                        <p className="text-gray-600 mb-4">
                            Practice coding questions.
                        </p>

                        <button className="bg-blue-600 text-white px-4 py-2 rounded">
                            View Problems
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-bold text-xl mb-3">
                            Contests
                        </h3>

                        <p className="text-gray-600 mb-4">
                            Join live coding contests.
                        </p>

                        <button className="bg-green-600 text-white px-4 py-2 rounded">
                            View Contests
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-bold text-xl mb-3">
                            Submissions
                        </h3>

                        <p className="text-gray-600 mb-4">
                            Check your previous submissions.
                        </p>

                        <button className="bg-purple-600 text-white px-4 py-2 rounded">
                            View History
                        </button>
                    </div>

                </div>

            </main>

        </div>
    );
};

export default Dashboard;