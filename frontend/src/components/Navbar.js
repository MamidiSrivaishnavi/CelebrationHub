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
        <Typography variant='h6' sx={{flexGrow:1}}>
          CelebrationHub
        </Typography>
        {user && (
          <Box>
            <Button color='inherit' onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button color='inherit' onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
