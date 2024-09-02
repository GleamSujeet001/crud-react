import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, CardMedia, Typography, IconButton, Avatar,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
  TextField, FormControlLabel, RadioGroup, Radio, Select, MenuItem, Table,
  TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ViewList as ViewListIcon, ViewModule as ViewModuleIcon } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Slide from '@mui/material/Slide';

function StudentList({ setIsAuthenticated, setUserImage ,searchQuery}) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);
  const [editData, setEditData] = useState({
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    gender: '',
    status: '',
    location: '',
    image: null,
  });

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];
  useEffect(() => {
    const filtered = rows.filter(row =>
      row.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchQuery, rows]);
  

  useEffect(() => {
    setIsAuthenticated(true);
    axios.get('https://crud-node-kun7.onrender.com/get-student-data')
      .then((response) => {
        setRows(response.data);
        setFilteredRows(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [setUserImage]);

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditData({
      fname: row.fname,
      lname: row.lname,
      email: row.email,
      mobile: row.mobile,
      gender: row.gender,
      status: row.status,
      location: row.location,
      image: row.image,
    });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleGenderChange = (e) => {
    setEditData(prevState => ({ ...prevState, gender: e.target.value }));
  };

  const handleStatusChange = (e) => {
    setEditData(prevState => ({ ...prevState, status: e.target.value }));
  };

  const handleEditSubmit = () => {
    if (selectedRow) {
      const formData = new FormData();
      formData.append('fname', editData.fname);
      formData.append('lname', editData.lname);
      formData.append('email', editData.email);
      formData.append('mobile', editData.mobile);
      formData.append('gender', editData.gender);
      formData.append('status', editData.status);
      formData.append('location', editData.location);

      if (editData.image) {
        formData.append('image', editData.image);
      }

      axios.put(`https://crud-node-kun7.onrender.com/update-student-data/${selectedRow._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(() => {
          axios.get('https://crud-node-kun7.onrender.com/get-student-data')
            .then((response) => {
              setRows(response.data);
              toast.success('Updated successfully!');
              setEditOpen(false);
            })
            .catch((error) => {
              console.error('Error fetching updated data:', error);
              toast.error('Error fetching updated data');
            });
        })
        .catch((error) => {
          console.error('Error updating item:', error);
          toast.error('Error updating item');
        });
    }
  };

  const handleClickOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      axios.delete(`https://crud-node-kun7.onrender.com/delete-student-data/${selectedId}`)
        .then(() => {
          setRows(rows.filter(row => row._id !== selectedId));
          toast.success('Deleted successfully!');
          handleClose();
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
          handleClose();
        });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton
          aria-label="list view"
          color={viewMode === 'list' ? 'primary' : 'default'}
          onClick={() => setViewMode('list')}
        >
          <ViewListIcon />
        </IconButton>
        <IconButton
          aria-label="card view"
          color={viewMode === 'card' ? 'primary' : 'default'}
          onClick={() => setViewMode('card')}
        >
          <ViewModuleIcon />
        </IconButton>
      </Box>

      {viewMode === 'list' ? (
        <TableContainer component={Paper} sx={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}>
          <Table sx={{ minWidth: 650 }} aria-label="student table">
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>S.no</strong></TableCell>
                <TableCell align="center"><strong>Name</strong></TableCell>
                <TableCell align="center"><strong>Email</strong></TableCell>
                <TableCell align="center"><strong>Mobile</strong></TableCell>
                <TableCell align="center"><strong>Gender</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Location</strong></TableCell>
                <TableCell align="center"><strong>Profile</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow
                  key={row._id}
                  hover
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell align="center">{row.fname} {row.lname}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="center">{row.mobile}</TableCell>
                  <TableCell align="center">{row.gender}</TableCell>
                  <TableCell align="center"><span style={{ color: row.status === 'Active' ? 'green' : 'red' }}>{row.status}</span></TableCell>
                  <TableCell align="center">{row.location}</TableCell>
                  <TableCell align="center">
                    <Avatar
                      alt={row.fname}
                      src={row.profile ? `https://crud-node-kun7.onrender.com/${row.profile}?t=${new Date().getTime()}` : '/man.png'}
                      sx={{ width: 56, height: 56 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="edit" style={{ color: 'blue' }} onClick={() => handleEdit(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" style={{ color: 'red' }} onClick={() => handleClickOpen(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </TableContainer>
      ) : (
        <Grid container spacing={2}>
      {filteredRows.map((row) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={row._id}>
          <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
            <CardMedia
              component="div"
              sx={{
                height: 140, // Set a fixed height for the image container
                backgroundImage: `url(${row.profile ? `https://crud-node-kun7.onrender.com/${row.profile}?t=${new Date().getTime()}` : '/man.jpg'})`,
                backgroundSize: 'contain', // Scale the image to fit the container
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              title={`${row.fname} ${row.lname}`}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {row.fname} {row.lname}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {row.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mobile: {row.mobile}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gender: {row.gender}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: <span style={{ color: row.status === 'Active' ? 'green' : 'red' }}>{row.status}</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {row.location}
              </Typography>
            </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <IconButton aria-label="edit" style={{ color: 'blue' }} onClick={() => handleEdit(row)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" style={{ color: 'red' }} onClick={() => handleClickOpen(row._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
      )}

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        TransitionComponent={Transition}
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} style={{ color: 'red' }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Student Data</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="fname"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editData.fname}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="lname"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editData.lname}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editData.email}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="mobile"
            label="Mobile"
            type="text"
            fullWidth
            variant="outlined"
            value={editData.mobile}
            onChange={handleEditChange}
          />
          <RadioGroup
            name="gender"
            value={editData.gender}
            onChange={handleGenderChange}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
          </RadioGroup>
          <Select
            name="status"
            value={editData.status}
            onChange={handleStatusChange}
            fullWidth
            variant="outlined"
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="outlined"
            value={editData.location}
            onChange={handleEditChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditData(prevState => ({ ...prevState, image: e.target.files[0] }))}
            style={{ marginTop: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentList;
