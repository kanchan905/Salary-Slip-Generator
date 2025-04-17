import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const PayMatrixCell = () => {
  const [cellName, setCellName] = useState('');
  const [basicPay, setBasicPay] = useState('');
  const [cells, setCells] = useState([
    { name: 'Cell A', pay: 25000 },
    { name: 'Cell B', pay: 27000 },
  ]);

  const handleAdd = () => {
    if (cellName && basicPay) {
      setCells([...cells, { name: cellName, pay: basicPay }]);
      setCellName('');
      setBasicPay('');
    }
  };

  return (
    <Paper sx={{ p: 3, boxShadow:0 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Level 1 - Entry Level</Typography>
        <Box>
          <IconButton color="primary"><Edit /></IconButton>
          <IconButton color="error"><Delete /></IconButton>
        </Box>
      </Box>

      {/* Form */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Cell Name"
            value={cellName}
            onChange={(e) => setCellName(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Basic Pay"
            type="number"
            value={basicPay}
            onChange={(e) => setBasicPay(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={handleAdd}
            sx={{ height: '100%' }}
          >
            Add Cell
          </Button>
        </Grid>
      </Grid>

      {/* Table */}
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
            {cells.map((cell, index) => (
              <TableRow key={index}>
                <TableCell>{cell.name}</TableCell>
                <TableCell>₹ {cell.pay}</TableCell>
                <TableCell>
                  <IconButton color="primary" size="small"><Edit /></IconButton>
                  <IconButton color="error" size="small"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PayMatrixCell;
