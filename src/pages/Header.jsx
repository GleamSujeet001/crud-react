import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import ProfileCard from "./ProfileCard"; // Import ProfileCard component

const settings = [
  { label: "Profile", icon: <PersonIcon /> },
  { label: "Logout", icon: <LogoutIcon /> },
];

function Header({ setIsAuthenticated, userData, onSearch }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileCardOpen, setProfileCardOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  const storedUserData =
    JSON.parse(localStorage.getItem("userData")) || userData;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenUser = () => {
    navigate("/Signup-list");
  };
  const handleOpenAdUser = () => {
    navigate("/Adduser");
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (onSearch) {
      onSearch(event.target.value); // Call the search function passed as a prop
    }
  };

  const baseURL = "https://crud-node-kun7.onrender.com/";

  const handleProfileUpdate = (updatedData) => {
    console.log("Updated profile data:", updatedData);
    // Handle the update logic here
  };

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <NavLink
          className="navbar-brand"
          to="/Student-list"
          style={{
            marginLeft: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzpExVyX0u7sbSBpSxVdui50mn1_slr9JXTw&s"
            alt="Logo"
            width="40"
            height="35"
            className="d-inline-block align-text-top"
            style={{ marginRight: "0.5rem" }}
          />
          <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>SMS</span>
        </NavLink>

        {/* Home Button */}
        {(location.pathname === "/Adduser" ||
          location.pathname === "/Signup-list") && (
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            sx={{ marginLeft: "auto", marginRight: "1rem" }}
            onClick={() => navigate("/Student-list")}
          >
            Home
          </Button>
        )}

        {location.pathname === "/" && (
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{ marginLeft: "auto", marginRight: "1rem" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
        {location.pathname === "/login" && (
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{ marginLeft: "auto", marginRight: "1rem" }}
            onClick={() => navigate("/")}
          >
            Signup
          </Button>
        )}
        {/* Conditionally render avatar only on /signup-list or /Student-list */}
        {location.pathname === "/Student-list" && (
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ marginRight: "1rem" }}
            />
            <Button
              onClick={handleOpenUser}
              sx={{ marginRight: "1rem" }}
              variant="contained"
              startIcon={<PersonIcon />}
            >
              All Users
            </Button>
            <Button
              onClick={handleOpenAdUser}
              sx={{ marginRight: "1rem" }}
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add Students
            </Button>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  src={
                    storedUserData
                      ? `${baseURL}${storedUserData}?t=${new Date().getTime()}`
                      : "/man.png"
                  }
                  alt="User Avatar"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    if (setting.label === "Logout") {
                      handleLogout();
                    } else if (setting.label === "Profile") {
                      setProfileCardOpen(true);
                    }
                    handleCloseUserMenu();
                  }}
                >
                  <ListItemIcon>{setting.icon}</ListItemIcon>
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </div>

      <ProfileCard
        open={profileCardOpen}
        onClose={() => setProfileCardOpen(false)}
        userData={storedUserData}
        onUpdate={handleProfileUpdate}
      />
    </nav>
  );
}

export default Header;
