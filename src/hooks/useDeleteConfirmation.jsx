import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';


const useDeleteConfirmation = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [resolvePromise, setResolvePromise] = useState(null);


    const showDialog = () => {
        setDialogOpen(true);
        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const handleConfirm = () => {
        if (resolvePromise) resolvePromise(true);
        setDialogOpen(false);
    };

    const handleCancel = () => {
        if (resolvePromise) resolvePromise(false);
        setDialogOpen(false);
    };

    const ConfirmationDialog = () => (
        <Dialog open={dialogOpen} onClose={handleCancel}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>Are you sure you want to delete?</DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );

    return { ConfirmationDialog, showDialog };
};

export default useDeleteConfirmation;
