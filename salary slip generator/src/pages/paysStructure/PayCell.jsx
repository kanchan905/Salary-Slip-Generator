import React, { useState } from 'react';
import {
  Box, Button, Grid, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { addCellToLevel, updateCellInLevel, deleteCellFromLevel } from '../../redux/slices/levelSlice';

const PayMatrixCell = () => {
  const dispatch = useDispatch();
  const levels = useSelector((state) => state.levels.levels);

  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [cellName, setCellName] = useState('');
  const [basicPay, setBasicPay] = useState('');

  const [editingCellId, setEditingCellId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedPay, setEditedPay] = useState('');

  const handleAddCell = () => {
    if (selectedLevelId && cellName && basicPay) {
      dispatch(addCellToLevel({
        levelId: Number(selectedLevelId),
        cell: {
          id: Date.now(),
          name: cellName,
          pay: Number(basicPay)
        }
      }));
      setCellName('');
      setBasicPay('');
    }
  };

  const handleStartEdit = (cell) => {
    setEditingCellId(cell.id);
    setEditedName(cell.name);
    setEditedPay(cell.pay);
  };

  const handleSaveEdit = (cellId) => {
    dispatch(updateCellInLevel({
      levelId: Number(selectedLevelId),
      cellId,
      updatedCell: {
        name: editedName,
        pay: Number(editedPay)
      }
    }));
    setEditingCellId(null);
  };

  const handleCancelEdit = () => {
    setEditingCellId(null);
  };

  const handleDeleteCell = (cellId) => {
    dispatch(deleteCellFromLevel({
      levelId: Number(selectedLevelId),
      cellId
    }));
  };

  const selectedLevel = levels.find(lvl => lvl.id === Number(selectedLevelId));

  return (
    <Paper sx={{ p: 3, boxShadow: 'none' }}>
      <Typography variant="h6" mb={2}>Pay Matrix Cells</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Select Pay Level</InputLabel>
        <Select
          value={selectedLevelId}
          label="Select Pay Level"
          onChange={(e) => setSelectedLevelId(e.target.value)}
        >
          {levels.map((level) => (
            <MenuItem key={level.id} value={level.id}>
              {level.levelName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedLevelId && (
        <>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Cell Name"
                value={cellName}
                onChange={(e) => setCellName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Basic Pay"
                type="number"
                value={basicPay}
                onChange={(e) => setBasicPay(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                sx={{ height: '100%' }}
                onClick={handleAddCell}
              >
                Add Cell
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><b>Cell Name</b></TableCell>
                  <TableCell><b>Basic Pay</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedLevel?.cells?.map((cell) => (
                  <TableRow key={cell.id}>
                    <TableCell>
                      {editingCellId === cell.id ? (
                        <TextField
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      ) : cell.name}
                    </TableCell>
                    <TableCell>
                      {editingCellId === cell.id ? (
                        <TextField
                          type="number"
                          value={editedPay}
                          onChange={(e) => setEditedPay(e.target.value)}
                        />
                      ) : `₹ ${cell.pay}`}
                    </TableCell>
                    <TableCell>
                      {editingCellId === cell.id ? (
                        <>
                          <IconButton color="success" onClick={() => handleSaveEdit(cell.id)}><Save /></IconButton>
                          <IconButton color="warning" onClick={handleCancelEdit}><Cancel /></IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton color="primary" onClick={() => handleStartEdit(cell)}><Edit /></IconButton>
                          <IconButton color="error" onClick={() => handleDeleteCell(cell.id)}><Delete /></IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
};

export default PayMatrixCell;
