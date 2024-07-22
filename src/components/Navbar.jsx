import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutReducer } from '../features/authSlice';
import { Menu, MenuItem, Fade } from '@mui/material';

const Navbar = () => {
    const navigate = useNavigate();
    const { token, avatar, firstName, role } = useSelector((state) => state.auth.auth);
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

    const allLinks = [
        { to: '/admin/dashboard', label: 'Dashboard', roles: ['admin'] },
        { to: '/user/books', label: 'Books', roles: ['user'] },
        // { to: '/order', label: 'Order', roles: ['user'] },
    ];

    const links = allLinks.filter(link => link.roles.includes(role));

    return (
        <div className="flex justify-end items-center bg-blue-600 px-2 h-14 gap-4">
            <div className='flex gap-4'>
                {links.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.to}
                        className={({ isActive }) =>
                            `font-semibold px-3 pb-1.5 pt-1 rounded ${isActive ? 'text-blue-600 bg-white' : 'text-white'}`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
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
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={handleLogout} className="font-semibold text-red-500">
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
};

export default Navbar;
