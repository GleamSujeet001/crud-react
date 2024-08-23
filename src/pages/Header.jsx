import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const settings = [
  { label: 'Profile', icon: <PersonIcon /> },
  { label: 'Logout', icon: <LogoutIcon /> },
];

function Header({ setIsAuthenticated, userImage  }) {
  const location = useLocation();
  const isSignupList = location.pathname === '/signup-list';
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Update authentication state
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgQ7WGNDT9mt2WRz9wjNvB0jXqVSuJAFldfA&s"
            alt="Logo"
            width="35"
            height="30"
            className="d-inline-block align-text-top"
          />
          React Demo
        </NavLink>

        {/* Conditionally render avatar only on /signup-list */}
        {isSignupList && (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="User" src={userImage || '/static/images/avatar/2.jpg'} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    if (setting.label === 'Logout') {
                      handleLogout();
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
    </nav>
  );
}

export default Header;
