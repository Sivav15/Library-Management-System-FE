import { useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const useLoadingModal = () => {
    const [loading, setLoading] = useState(false);

    const showLoading = () => {
        setLoading(true);
    };

    const hideLoading = () => {
        setLoading(false);
    };

    const LoadingModalComponent = () => (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );

    return { showLoading, hideLoading, LoadingModalComponent };
};

export default useLoadingModal;



