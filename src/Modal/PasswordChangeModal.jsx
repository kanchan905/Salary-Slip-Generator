import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { changeUserPassword } from '../redux/slices/userSlice'; // Adjust the import path as needed

export default function PasswordChangeModal({ open, onClose, user }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();

    // Effect to clear fields when the modal is closed or the user changes
    useEffect(() => {
        if (!open) {
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [open]);

    const handleSubmit = () => {
        // Safety check
        if (!user) {
            toast.error("No user selected.");
            return;
        }

        // 1. Check if passwords match
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        
        // 2. Check for password length
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        // 3. Dispatch if all checks pass
        dispatch(changeUserPassword({ id: user.id, password: newPassword }))
            .unwrap()
            .then(() => {
                toast.success(`Password for ${user.name} changed successfully.`);
                onClose(); // Close the modal on success
            })
            .catch((err) => {
                const apiMsg = err?.message || 'Failed to change password.';
                toast.error(apiMsg);
            });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {/* Use optional chaining to prevent errors if user is null initially */}
                    Enter a new password for user: <strong>{user?.name}</strong>
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="newPassword"
                    label="New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mt: 2 }} // Adds some space between the fields
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
            </DialogActions>
        </Dialog>
    );
}