import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' sx={{flexGrow:1, cursor:'pointer'}} onClick={() => navigate('/celebrations')}>
          CelebrationHub
        </Typography>
        <Button color='inherit' onClick={() => navigate('/celebrations')}>
          Browse
        </Button>
        {user ? (
          <Box>
            <Button color='inherit' onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button color='inherit' onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color='inherit' onClick={() => navigate('/')}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
