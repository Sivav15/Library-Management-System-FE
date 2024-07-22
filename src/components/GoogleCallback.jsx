import React from 'react'
import { googleCallback_api } from '../services/api';
import { useGoogleLogin } from '@react-oauth/google';
import useSnackbar from '../hooks/useSnackbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authReducer } from '../features/authSlice';
import { useDispatch } from 'react-redux';
import useLoadingModal from '../hooks/useLoadingModal';


const GoogleCallback = ({ action, role, message, setRole }) => {
    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const { showLoading, hideLoading, LoadingModalComponent } = useLoadingModal();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const register = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                if (action === 'register' && !role) {
                    return showSnackbar('Role is required', 'warning');
                }

                showLoading()
                const { data } = await axios.post(googleCallback_api, {
                    token: tokenResponse.access_token,
                    action,
                    role
                });
                showSnackbar(data.message, 'success');
                dispatch(authReducer(data));
                hideLoading()
                if (data.role === 'admin') {
                    navigate('/admin');
                    return
                }
                navigate('/user');
            } catch (error) {
                hideLoading()
                // console.log(error);
                if (error.response) {
                    const { status, data } = error.response;

                    if (status >= 500) {
                        showSnackbar(data.message, 'error');
                        return
                    }

                    showSnackbar(data.message, 'warning');


                } else {
                    showSnackbar('An unexpected error occurred', 'error');
                }


            } finally {
                if (action === 'register') setRole('')

            }




        },
        onError: (errorResponse) => {
            if (action === 'register') setRole('')
            showSnackbar(errorResponse, 'error')
        },
    });
    return (
        <>
            <button
                onClick={register}
                className="mt-4 w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                {message}
            </button>
            <SnackbarComponent />
            <LoadingModalComponent />
        </>
    )
}

export default GoogleCallback