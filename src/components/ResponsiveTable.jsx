import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import useSnackbar from '../hooks/useSnackbar';
import useLoadingModal from '../hooks/useLoadingModal';
import { DeleteBook_api, viewBook_api, viewBook_img_api } from '../services/api';
import { addBooksReducer } from '../features/bookSlice';
import axios from 'axios';
import EditBookModal from './EditBookModal';
import useDeleteConfirmation from '../hooks/useDeleteConfirmation';

const ResponsiveTable = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});

    const books = useSelector((state) => state.books.books);
    const { token, id } = useSelector((state) => state.auth.auth);
    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const { showLoading, hideLoading, LoadingModalComponent } = useLoadingModal();
    const { ConfirmationDialog, showDialog } = useDeleteConfirmation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            viewBookRequest();
        }
    }, [token]);

    const handleEdit = (bookData) => {
        setData(bookData);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const viewBookRequest = async () => {
        try {
            showLoading();

            const { data } = await axios.get(`${viewBook_api}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            dispatch(addBooksReducer(data.books));
        } catch (error) {
            console.log(error);
            if (error.response) {
                const { status, data } = error.response;

                if (status >= 500) {
                    showSnackbar(data.message, 'error');
                } else {
                    showSnackbar(data.message, 'warning');
                }
            } else {
                showSnackbar('An unexpected error occurred', 'error');
            }
        } finally {
            hideLoading();
        }
    };

    const deleteBook = async (id) => {
        try {
            const confirmToDelete = await showDialog();

            if (!confirmToDelete) {
                return;
            }

            showLoading();
            await axios.delete(`${DeleteBook_api}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const newBooks = books.filter((item) => item._id !== id);
            dispatch(addBooksReducer(newBooks));
        } catch (error) {
            console.log(error);
            if (error.response) {
                const { status, data } = error.response;

                if (status >= 500) {
                    showSnackbar(data.message, 'error');
                } else {
                    showSnackbar(data.message, 'warning');
                }
            } else {
                showSnackbar('An unexpected error occurred', 'error');
            }
        } finally {
            hideLoading();
        }
    };

    const columns = [
        {
            field: 'index',
            headerName: '#',
            minWidth: 90, // Minimum width for the # column
            renderCell: (params) => (
                <strong>{params.row.id + 1}</strong> // 1-based index
            ),
        },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 150, // Minimum width for the Title column
            flex: 1
        },
        {
            field: 'author',
            headerName: 'Author',
            minWidth: 150, // Minimum width for the Author column
            flex: 1
        },
        {
            field: 'img',
            headerName: 'Image',
            minWidth: 150, // Minimum width for the Image column
            flex: 0.5,
            renderCell: (params) => (
                <img
                    src={`${viewBook_img_api}/${params.value}`}
                    alt={params.row.title}
                    style={{ maxWidth: '100%', maxHeight: '50px', objectFit: 'contain' }}
                />
            ),
        },
        {
            field: 'borrowCount',
            headerName: 'Borrow Count',
            minWidth: 150, // Minimum width for the Borrow Count column
            flex: 0.5
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 150, // Minimum width for the Actions column
            flex: 0.5,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleEdit({ ...params.row, img: `${viewBook_img_api}/${params.row.img}` })} color="primary">
                        <FaEdit />
                    </IconButton>
                    <IconButton onClick={() => deleteBook(params.row._id)} color="secondary">
                        <FaTrash />
                    </IconButton>
                </>
            ),
        },
    ];

    const rows = books.map((item, index) => ({
        id: index, // using index for 1-based row number
        title: item.title,
        author: item.author,
        img: item.img,
        _id: item._id,
        borrowCount: item.borrowedBy.length || 0 // Include borrow count
    }));

    return (
        <div style={{ width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
            // rowsPerPageOptions={[5, 10]}
            // disableSelectionOnClick
            />
            <SnackbarComponent />
            <LoadingModalComponent />
            <EditBookModal open={open} onClose={handleClose} data={data} />
            <ConfirmationDialog />
        </div>
    );
};

export default ResponsiveTable;
