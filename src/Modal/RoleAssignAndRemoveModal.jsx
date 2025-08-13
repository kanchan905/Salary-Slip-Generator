import React, { useEffect, useState } from 'react';
import {
    Modal, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { assignUserRoles, removeUserRoles } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const RoleAssignAndRemoveModal = ({ open, onClose, user }) => {
    const dispatch = useDispatch();
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [actionType, setActionType] = useState('assign');
    const [filteredRoles, setFilteredRoles] = useState([]);
    // State to manage the open/closed status of the Select menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const allRolesList = [
        'Director',
        'Senior AO',
        'Administrative Officer',
        'Drawing and Disbursing Officer (NIOH)',
        'Drawing and Disbursing Officer (ROHC)',
        'Section Officer (Accounts)',
        'Accounts Officer',
        'Salary Processing Coordinator (NIOH)',
        'Salary Processing Coordinator (ROHC)',
        'Pensioners Operator',
        'End Users'
    ];

    useEffect(() => {
        if (user) {
            const assignedRoleNames = user.roles?.map(role => role.name) || [];
            if (actionType === 'assign') {
                setFilteredRoles(allRolesList.filter(role => !assignedRoleNames.includes(role)));
            } else {
                setFilteredRoles(assignedRoleNames);
            }
        }
        setSelectedRoles([]);
    }, [user, actionType]);

    const handleRolesChange = (event) => {
        const { target: { value } } = event;
        setSelectedRoles(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        // This will now close the menu after a selection is made
        setIsMenuOpen(false);
    };

    const handleSubmit = () => {
        const action = actionType === 'assign' ? assignUserRoles : removeUserRoles;
        dispatch(action({ id: user.id, roles: selectedRoles }))
            .unwrap()
            .then((res) => {
                toast.success(res.successMsg || 'Operation successful');
                onClose();
                setSelectedRoles([]);
            })
            .catch((err) => {
                const msg = err?.errorMsg || err?.message || 'Operation failed';
                toast.error(msg);
            });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'grey.500',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                    {actionType === 'assign' ? 'Assign Roles' : 'Remove Roles'} for {user?.name}
                </Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Action</InputLabel>
                    <Select
                        value={actionType}
                        label="Action"
                        onChange={(e) => setActionType(e.target.value)}
                    >
                        <MenuItem value="assign">Assign</MenuItem>
                        <MenuItem value="remove">Remove</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Roles</InputLabel>
                    <Select
                        multiple
                        open={isMenuOpen}
                        onOpen={() => setIsMenuOpen(true)}
                        onClose={() => setIsMenuOpen(false)}
                        value={selectedRoles}
                        onChange={handleRolesChange}
                        input={<OutlinedInput label="Roles" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 224,
                                },
                            },
                        }}
                    >
                        {filteredRoles.length > 0 ? filteredRoles.map((role) => (
                            <MenuItem key={role} value={role}>{role}</MenuItem>
                        )) : (
                            <MenuItem disabled>No roles available</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={selectedRoles.length === 0}
                >
                    {actionType === 'assign' ? 'Assign Role(s)' : 'Remove Role(s)'}
                </Button>
            </Box>
        </Modal>
    );
};

export default RoleAssignAndRemoveModal;