import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Avatar from "@mui/material/Avatar";
import ScaleLoader from "react-spinners/ScaleLoader"; // Import the spinner component

function SignupList({ setIsAuthenticated }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    username: "",
    contact: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3939/get-user-data")
      .then((response) => {
        setRows(response.data); // Populate rows with user data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data");
        setLoading(false);
      });
  }, []);

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditData({
      name: row.name,
      username: row.username,
      contact: row.contact,
      image: row.image,
    });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditSubmit = () => {
    if (selectedRow) {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("username", editData.username);
      formData.append("contact", editData.contact);

      // Only append the new image if one is selected
      if (editData.image && editData.image !== selectedRow.image) {
        formData.append("image", editData.image);
      }

      setLoading(true);
      axios
        .put(
          `http://localhost:3939/update-user-data/${selectedRow._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then(() => {
          axios
            .get("http://localhost:3939/get-user-data") // Fetch updated data
            .then((response) => {
              setRows(response.data);
              toast.success("Updated successfully!");
              setEditOpen(false);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching updated data:", error);
              toast.error("Error fetching updated data");
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error("Error updating item:", error);
          toast.error("Error updating item");
          setLoading(false);
        });
    }
  };

  const handleClickOpen = (id) => {
    setSelectedId(id); // Save the selected id for deletion
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      setLoading(true);
      axios
        .delete(`http://localhost:3939/delete-user-data/${selectedId}`)
        .then(() => {
          setRows(rows.filter((row) => row._id !== selectedId));
          toast.success("Deleted successfully!");
          handleClose();
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
          toast.error("Error deleting item");
          handleClose();
          setLoading(false);
        });
    }
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly opaque white overlay
            zIndex: 10,
          }}
        >
          <ScaleLoader color="#36d7b7" />
        </div>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>S.no</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>UserName</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.contact}</TableCell>
                <TableCell>
                  <Avatar
                    alt={row.name}
                    src={
                      row.imageUrl
                        ? `${row.imageUrl}?t=${new Date().getTime()}`
                        : `http://localhost:3939/${
                            row.image
                          }?t=${new Date().getTime()}`
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    style={{ color: "blue" }}
                    onClick={() => handleEdit(row)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    style={{ color: "red" }}
                    onClick={() => handleClickOpen(row._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-description"
      >
        <DialogTitle id="edit-dialog-title">Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
            value={editData.name}
            onChange={handleEditChange}
            autoComplete="off"
          />
          <TextField
            margin="dense"
            name="username"
            label="Username"
            fullWidth
            variant="standard"
            value={editData.username}
            onChange={handleEditChange}
            autoComplete="off"
          />
          <TextField
            margin="dense"
            name="contact"
            label="Contact"
            fullWidth
            variant="standard"
            value={editData.contact}
            onChange={handleEditChange}
            autoComplete="off"
          />
          <input
            type="file"
            onChange={(e) =>
              setEditData((prevState) => ({
                ...prevState,
                image: e.target.files[0],
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SignupList;
