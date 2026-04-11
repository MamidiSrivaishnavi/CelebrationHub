import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [celebrations, setCelebrations] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
    fetchCelebrations();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCelebrations = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/celebrations");
      const data = await res.json();
      setCelebrations(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`http://localhost:5000/admin/users/${id}`, {
        method: "DELETE",
      });
      alert("User deleted!");
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteCelebration = async (id) => {
    if (!window.confirm('Are you sure you want to delete this celebration?')) return;
    try {
      await fetch(`http://localhost:5000/admin/celebrations/${id}`, {
        method: "DELETE",
      });
      alert("Celebration deleted!");
      fetchCelebrations();
    } catch (err) {
      console.log(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Box sx={{padding:4}}>
      <Typography variant='h4' sx={{color:'#1976d2', fontWeight:'bold', marginBottom:4}}>
        Admin Dashboard
      </Typography>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{marginBottom:3}}>
        <Tab label="Users" />
        <Tab label="Celebrations" />
      </Tabs>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Created</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined"
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u._id === user._id}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Creator</strong></TableCell>
                <TableCell><strong>Event Date</strong></TableCell>
                <TableCell><strong>Created</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {celebrations.map((cel) => (
                <TableRow key={cel._id}>
                  <TableCell>{cel.title}</TableCell>
                  <TableCell>{cel.userId?.name || 'Unknown'}</TableCell>
                  <TableCell>{new Date(cel.eventDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(cel.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/celebration/${cel._id}`)}
                      sx={{marginRight:1}}
                    >
                      View
                    </Button>
                    <Button 
                      variant="outlined"
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteCelebration(cel._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminDashboard;
