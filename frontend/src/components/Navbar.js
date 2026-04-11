import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
    handleClose();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar position='static' elevation={0} sx={{
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      borderRadius: '0 0 16px 16px'
    }}>
      <Toolbar sx={{padding: { xs: '8px 16px', sm: '14px 28px' }}}>
        <Typography variant='h6' sx={{
          flexGrow:1, 
          cursor:'pointer', 
          fontWeight:700,
          color: '#5a6a85',
          letterSpacing:'0.5px',
          fontSize: { xs: '1.1rem', sm: '1.3rem' }
        }} onClick={() => navigate('/celebrations')}>
          🎉 CelebrationHub
        </Typography>
        
        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {user && (
            <Button sx={{
              color: '#5a6a85',
              textTransform:'none',
              fontWeight:600,
              '&:hover':{
                background: 'rgba(146, 168, 209, 0.15)'
              },
              borderRadius:3,
              padding:'8px 18px'
            }} onClick={() => navigate('/celebrations')}>
              Browse
            </Button>
          )}
          {user ? (
            <>
              <Button sx={{
                color: '#5a6a85',
                textTransform:'none',
                fontWeight:600,
                '&:hover':{
                  background: 'rgba(146, 168, 209, 0.15)'
                },
                borderRadius:3,
                padding:'8px 18px'
              }} onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              {user.role === 'admin' && (
                <Button sx={{
                  color: '#5a6a85',
                  textTransform:'none',
                  fontWeight:600,
                  '&:hover':{
                    background: 'rgba(146, 168, 209, 0.15)'
                  },
                  borderRadius:3,
                  padding:'8px 18px'
                }} onClick={() => navigate('/admin')}>
                  Admin
                </Button>
              )}
              <Button sx={{
                color: '#5a6a85',
                textTransform:'none',
                fontWeight:600,
                '&:hover':{
                  background: 'rgba(146, 168, 209, 0.15)'
                },
                borderRadius:3,
                padding:'8px 18px'
              }} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button sx={{
              color: '#5a6a85',
              textTransform:'none',
              fontWeight:600,
              '&:hover':{
                background: 'rgba(146, 168, 209, 0.15)'
              },
              borderRadius:3,
              padding:'8px 18px'
            }} onClick={() => navigate('/')}>
              Login
            </Button>
          )}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            onClick={handleMenu}
            sx={{ color: '#5a6a85' }}
          >
            <Typography sx={{ fontSize: '1.5rem' }}>☰</Typography>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {user && (
              <MenuItem onClick={() => handleNavigate('/celebrations')}>Browse</MenuItem>
            )}
            {user ? (
              <>
                <MenuItem onClick={() => handleNavigate('/dashboard')}>Dashboard</MenuItem>
                {user.role === 'admin' && (
                  <MenuItem onClick={() => handleNavigate('/admin')}>Admin</MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => handleNavigate('/')}>Login</MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
