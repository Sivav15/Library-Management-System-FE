import React, { useState, useEffect, useRef } from 'react';
import { Dialog, TextField, Button, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import useSnackbar from '../hooks/useSnackbar';
import useLoadingModal from '../hooks/useLoadingModal';

// Validation schema
const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    author: Yup.string().required('Author is required'),
    img: Yup.mixed().required('Image is required'),
});

const AddBookModal = ({ open, onClose }) => {
    const [imgPreview, setImgPreview] = useState(null);
    const [imgFileName, setImgFileName] = useState('');
    const fileInputRef = useRef(null);

    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const { showLoading, hideLoading, LoadingModalComponent } = useLoadingModal();
    const { token, id } = useSelector((state) => state.auth.auth);
    const dispatch = useDispatch();

    // Formik setup
    const formik = useFormik({
        initialValues: {
            title: '',
            author: '',
            img: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            showLoading();

            try {
                // Upload image
                const formData = new FormData();
                formData.append('file', values.img);

                const imgRes = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const imgURL = imgRes.data.url;

                // Submit book data
                const bookData = {
                    title: values.title,
                    author: values.author,
                    img: imgURL,
                    user_id: id
                };

                const res = await axios.post('/api/books', bookData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                dispatch({ type: 'ADD_BOOK', payload: res.data });

                formik.resetForm();
                setImgPreview(null);
                setImgFileName('');
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

    // Clear form and image preview when the modal is closed
    useEffect(() => {
        if (!open) {
            formik.resetForm();
            setImgPreview(null);
            setImgFileName('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
                <p className="text-lg font-semibold mb-4">Add Book</p>
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
                    <input
                        type="file"
                        accept="image/*"
                        id="upload-button"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(event) => {
                            formik.setFieldValue("img", event.currentTarget.files[0]);
                            if (event.currentTarget.files[0]) {
                                setImgPreview(URL.createObjectURL(event.currentTarget.files[0]));
                                setImgFileName(event.currentTarget.files[0].name);
                            }
                        }}
                    />
                    <label htmlFor="upload-button">
                        <Button
                            variant="contained"
                            component="span"
                            color="primary"
                            sx={{ mt: 3 }}
                            startIcon={<FaCloudUploadAlt />}
                            className="w-full"
                        >
                            Upload Image
                        </Button>
                    </label>
                    {formik.touched.img && formik.errors.img && (
                        <div className="text-red-500 text-sm">{formik.errors.img}</div>
                    )}
                    {imgPreview && (
                        <div className="flex items-center mt-4 space-x-4">
                            <img src={imgPreview} alt="Preview" className="w-12 h-12 object-contain rounded-md" />
                            <p className="text-sm">{imgFileName}</p>
                            <IconButton onClick={() => {
                                formik.setFieldValue("img", null);
                                setImgPreview(null);
                                setImgFileName('');
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}>
                                <MdDelete />
                            </IconButton>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4 mt-6">
                        <Button
                            type="button"
                            onClick={() => {
                                formik.resetForm();
                                setImgPreview(null);
                                setImgFileName('');
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
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

export default AddBookModal;
