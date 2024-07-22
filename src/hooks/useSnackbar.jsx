import { useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const useSnackbar = () => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info', // 'error', 'warning', 'info', 'success'
    });

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    }, []);

    const closeSnackbar = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    const SnackbarComponent = useCallback(() => (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={closeSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    ), [snackbar])

    return { showSnackbar, SnackbarComponent };
};

export default useSnackbar;
