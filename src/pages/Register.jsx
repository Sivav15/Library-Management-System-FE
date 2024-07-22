import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
// import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { register_api } from '../services/api';
import useSnackbar from '../hooks/useSnackbar';
import useLoadingModal from '../hooks/useLoadingModal';
import { authReducer } from '../features/authSlice';
import { useDispatch } from 'react-redux';
import GoogleCallback from '../components/GoogleCallback';
import RoleSelector from '../components/RoleSelector';


// Define validation schema
const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const Register = () => {
    const [role, setRole] = useState('')
    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const { showLoading, hideLoading, LoadingModalComponent } = useLoadingModal();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {


                if (!role) {
                    return showSnackbar('Role is Required!', 'warning')

                }

                showLoading()
                values.role = role
                const { data } = await axios.post(register_api, values);
                showSnackbar(data.message, 'success');
                dispatch(authReducer(data));
                if (data.role === 'admin') {
                    navigate('/admin');
                    return
                }
                navigate('/user');
            } catch (error) {
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
                hideLoading()
            }
        }
    });



    const loginNavigation = () => {
        navigate('/');
    }


    return (
        <div className="flex items-center justify-center  h-screen">

            <div className='rounded-lg shadow-md w-96  border border-gray-200 bg-white '>
                <div className='flex justify-end'>
                    <RoleSelector role={role} setRole={setRole} />
                </div>
                <div className='p-8 pt-5'>
                    <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">Signup</h2>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <TextField
                                name="firstName"
                                label="First Name"
                                // variant="outlined"
                                size="small"
                                fullWidth
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.firstName}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                name="lastName"
                                label="Last Name"
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.lastName}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                name="email"
                                label="Email"
                                variant="outlined"
                                size="small"
                                type="email"
                                fullWidth
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                name="password"
                                label="Password"
                                variant="outlined"
                                size="small"
                                type="password"
                                fullWidth
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                name="confirmPassword"
                                label="Confirm Password"
                                variant="outlined"
                                size="small"
                                type="password"
                                fullWidth
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={formik.isSubmitting}
                        >
                            Signup
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">Already have an account? <span onClick={loginNavigation} className="text-blue-600 cursor-pointer">Login</span></p>
                        <GoogleCallback action={'register'} message={'Signup with Google'} role={role} setRole={setRole} />
                    </div>
                </div>

            </div>
            <SnackbarComponent />
            <LoadingModalComponent />
        </div>
    );
}

export default Register;
