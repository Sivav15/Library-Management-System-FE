import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import useSnackbar from '../hooks/useSnackbar';
import useLoadingModal from '../hooks/useLoadingModal';
import axios from 'axios';
import { viewBook_api } from '../services/api';
import { addBooksReducer } from '../features/bookSlice';
import BookCard from '../components/BookCard';

function Books() {
    const books = useSelector((state) => state.books.books);
    const { token, id } = useSelector((state) => state.auth.auth);
    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const { showLoading, hideLoading, LoadingModalComponent } = useLoadingModal();

    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            viewBookRequest();
        }
    }, [token]);


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



    return (
        <div className='w-full'>
            <div className="mx-auto  p-2 md:p-4 w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-flow-col-6 gap-2 md:gap-4 w-full">
                    {
                        books.map((book) => {
                            return <BookCard key={book._id} title={book.title} img={book.img} author={book.author} _id={book._id} isBorrowedByUser={book.isBorrowedByUser} />
                        })
                    }
                </div>
            </div>
            <SnackbarComponent />
            <LoadingModalComponent />
        </div>
    )
}

export default Books