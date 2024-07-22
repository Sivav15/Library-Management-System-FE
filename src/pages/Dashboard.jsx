import React, { useState } from 'react'
import ViewBook from '../components/ViewBook'
import AddBookModal from '../components/AddBookModal';

function Dashboard() {

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div className='m-2'>
            <div>
                <button className="px-6 py-1 mb-2 bg-blue-600 text-white rounded" onClick={handleClick}>Add Book</button>
            </div>

            <div>
                <ViewBook />
            </div>
            <AddBookModal open={open} onClose={handleClose} />
        </div>
    )
}

export default Dashboard