import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutReducer } from '../features/authSlice';
import { Menu, MenuItem, Fade } from '@mui/material';
const Navbar = () => {
    const navigate = useNavigate();
    const { token, avatar, firstName } = useSelector((state) => state.auth.auth);
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logoutReducer());
        navigate('/');
    };

    return (
        <div className="flex justify-end items-center bg-blue-600 px-2 h-14 gap-4">
            <div>
                <NavLink
                    // key={index}
                    to={'/admin'}
                    className={({ isActive }) =>
                        "font-semibold px-3 pb-1.5 pt-1 rounded" +
                        (isActive ? " text-blue-600 bg-white" : " text-white")
                    }
                >
                    {'Dashboard'}
                </NavLink>
            </div>
            <div className="rounded-full cursor-pointer" onClick={handleClick}>
                <img
                    src={avatar}
                    alt={firstName}
                    className="rounded-full w-9 h-9 object-cover"
                />
            </div>
            <Menu
                id="fade-menu"
                // MenuListProps={{
                //     'aria-labelledby': 'fade-button',
                // }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <button
                    className="font-semibold px-3 pt-0.5 pb-1 m-2 rounded text-white bg-red-500 outline-none"
                    onClick={handleLogout}
                >
                    Logout
                </button>
                {/* <MenuItem onClick={handleLogout} >Logout</MenuItem> */}
            </Menu>
        </div >
    );
};

export default Navbar;
