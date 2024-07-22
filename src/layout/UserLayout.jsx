import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function UserLayout() {
    return (
        <div>
            <div className='sticky top-0 w-full'>
                <Navbar />
            </div>
            <Outlet />
        </div>
    )
}

export default UserLayout