import React from 'react';
import { useSelector } from 'react-redux';

const User_ProtectedRoute = ({ children }) => {
    const { token, role } = useSelector((state) => state.auth.auth);

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-50 text-green-800 font-semibold text-lg border border-green-300 rounded-lg shadow-md p-6">
                <p className="text-center">Access Denied: Please log in to continue.</p>
            </div>
        );
    }

    if (role !== 'user') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-800 font-semibold text-lg border border-red-300 rounded-lg shadow-md p-6">
                <p className="text-center">Access Denied: You do not have the required permissions to view this page.</p>
            </div>
        );
    }

    return children;
};

export default User_ProtectedRoute;
