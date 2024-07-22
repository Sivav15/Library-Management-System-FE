import React, { useState, useEffect, useRef } from 'react';
import { Dialog, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import useSnackbar from '../hooks/useSnackbar';
import useLoadingModal from '../hooks/useLoadingModal';

// import { updateBookReducer } from '../features/bookSlice';
import { updateBook_api } from '../services/api';
import { addBooksReducer } from '../features/bookSlice';

// Validation schema
const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    author: Yup.string().required('Author is required'),
});

const EditBookModal = ({ open, onClose, data }) => {
    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const { showLoading, hideLoading, LoadingModalComponent } = useLoadingModal();
    const { token } = useSelector((state) => state.auth.auth);
    const books = useSelector((state) => state.books.books);

    const dispatch = useDispatch();

    // Formik setup
    const formik = useFormik({
        initialValues: {
            title: '',
            author: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            showLoading();

            const val = {
                title: values.title,
                author: values.author,

            }

            try {
                const response = await axios.put(`${updateBook_api}/${data._id}`, val, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const newBooks = books.map((book) => {
                    if (book._id === data._id) {
                        return response.data.book
                    }
                    return book
                })

                dispatch(addBooksReducer(newBooks));

                formik.resetForm();
                onClose();

            } catch (error) {
                console.error(error);
                if (error.response) {
                    showSnackbar(error.response.data.message, error.response.status >= 500 ? 'error' : 'warning');
                } else {
                    showSnackbar('An unexpected error occurred', 'error');
                }
            } finally {
                hideLoading();
            }
        },
    });

    // Clear form when the modal is closed
    useEffect(() => {
        if (!open) {
            formik.resetForm();
        }
    }, [open]);

    // Update formik values when data changes
    useEffect(() => {
        if (data) {
            formik.setValues({
                title: data.title,
                author: data.author,
            });
        }
    }, [data]);

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
                <p className="text-lg font-semibold mb-4">Edit Book</p>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <TextField
                        label="Title"
                        type="text"
                        fullWidth
                        name="title"
                        size="small"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                        className="rounded-md"
                    />
                    <TextField
                        margin="dense"
                        size="small"
                        label="Author"
                        type="text"
                        fullWidth
                        name="author"
                        value={formik.values.author}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.author && Boolean(formik.errors.author)}
                        helperText={formik.touched.author && formik.errors.author}
                        className="rounded-md"
                    />
                    <div className="flex justify-end space-x-4 mt-6">
                        <Button
                            type="button"
                            onClick={() => {
                                formik.resetForm();
                                onClose();
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>
            <SnackbarComponent />
            <LoadingModalComponent />
        </Dialog>
    );
};

export default EditBookModal;
