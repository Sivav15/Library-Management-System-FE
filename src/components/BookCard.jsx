import React from 'react';
import { borrowBook_api, returnBook_api, viewBook_img_api } from '../services/api';
import useSnackbar from '../hooks/useSnackbar';
import useLoadingModal from '../hooks/useLoadingModal';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addBooksReducer } from '../features/bookSlice';

const BookCard = ({ title, img, author, _id, isBorrowedByUser }) => {

    // borrowBook_api
    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const { showLoading, hideLoading, LoadingModalComponent } = useLoadingModal();
    const { token, id } = useSelector((state) => state.auth.auth);
    const books = useSelector((state) => state.books.books);
    // console.log(books);

    const dispatch = useDispatch();

    const borrow_Book_Request = async (values) => {
        showLoading();

        try {



            const { data } = await axios.post(borrowBook_api, {
                book_id: _id,
                user_id: id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });


            const newBooks = books.map((book) => {
                if (book._id === data.book._id) {
                    return {
                        ...book,
                        isBorrowedByUser: true
                    }
                }
                return book
            })




            dispatch(addBooksReducer(newBooks));
            showSnackbar(data.message, 'success');

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
    }


    const return_Book_Request = async (values) => {
        showLoading();

        try {



            const { data } = await axios.post(returnBook_api, {
                book_id: _id,
                user_id: id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });


            const newBooks = books.map((book) => {
                if (book._id === data.book._id) {
                    return {
                        ...book,
                        isBorrowedByUser: false
                    }
                }
                return book
            })

            dispatch(addBooksReducer(newBooks));
            showSnackbar(data.message, 'success');
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
    }


    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-400 overflow-hidden">
            <img className="w-full h-52 object-contain" src={`${viewBook_img_api}/${img}`} alt={title} />
            <div className="p-1 md:p-4">
                <h2 className="text-center text-md md:text-lg font-bold mb-0.5">Book Details</h2>
                <p className="text-center font-semibold text-md mb-1">{title}</p>
                <p className="text-center mb-2 text-sm md:text-md"><strong>Author:</strong> {author}</p>
                <div className="flex justify-center md:mb-0 mb-1.5">
                    {
                        isBorrowedByUser ? <button className="bg-red-500 text-sm md:text-md font-semibold text-white md:py-2 md:px-4  py-1.5  px-3 rounded" onClick={return_Book_Request}>Borrowed </button> : <button className="bg-purple-500 text-sm md:text-md font-semibold text-white md:py-2 md:px-4  py-1.5  px-3 rounded" onClick={borrow_Book_Request}>Borrow Book</button>
                    }

                </div>
            </div>
            <SnackbarComponent />
        </div>
    );
};



export default BookCard;
