import API_URL from '../config';
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
      const res = await fetch(`${API_URL}/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCelebrations = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/celebrations`);
      const data = await res.json();
      setCelebrations(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`${API_URL}/admin/users/${id}`, {
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
      await fetch(`${API_URL}/admin/celebrations/${id}`, {
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
    <Box sx={{padding:4, minHeight:'100vh'}}>
      <Typography variant='h4' sx={{
        color:'#5a6a85', 
        fontWeight:'bold', 
        marginBottom:4
      }}>
        Admin Dashboard
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={(e, newValue) => setTabValue(newValue)} 
        sx={{
          marginBottom:3,
          '& .MuiTab-root': {
            color: '#5a6a85',
            textTransform: 'none',
            fontWeight: 600
          },
          '& .Mui-selected': {
            color: '#92A8D1'
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#92A8D1'
          }
        }}
      >
        <Tab label="Users" />
        <Tab label="Celebrations" />
      </Tabs>

      {tabValue === 0 && (
        <TableContainer component={Paper} sx={{
          borderRadius:'16px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(146, 168, 209, 0.15)'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{color:'#5a6a85', fontWeight:'bold'}}>Name</TableCell>
                <TableCell sx={{color:'#5a6a85', fontWeight:'bold'}}>Email</TableCell>
                <TableCell sx={{color:'#5a6a85', fontWeight:'bold'}}>Role</TableCell>
                <TableCell sx={{color:'#5a6a85', fontWeight:'bold'}}>Created</TableCell>
                <TableCell sx={{color:'#5a6a85', fontWeight:'bold'}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell sx={{color:'#5a6a85'}}>{u.name}</TableCell>
                  <TableCell sx={{color:'#5a6a85'}}>{u.email}</TableCell>
                  <TableCell sx={{color:'#5a6a85'}}>{u.role}</TableCell>
                  <TableCell sx={{color:'#5a6a85'}}>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined"
                      size="small"
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u._id === user._id}
                      sx={{
                        borderColor: '#F7CAC9',
                        color: '#F7CAC9',
                        textTransform:'none',
                        borderRadius:'12px',
                        '&:hover':{
                          borderColor: '#e5b3b2',
                          background: 'rgba(247, 202, 201, 0.1)'
                        }
                      }}
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
        <TableContainer component={Paper} sx={{
          borderRadius:'16px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(146, 168, 209, 0.15)'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{color:'#5a6a85', fontWeight:'bold'}}>Title</TableCell>
                <TableCell sx={{color:'#5a6a85', fontWeight:'bold'}}>Creator</TableCell>
                <TableCell sx={{color:'#5a6a85', fontWeight:'bold'}}>Event Date</TableCell>
                <TableCell sx={{color:'#5a6a85', fontWeight:'bold'}}>Created</TableCell>
                <TableCell sx={{color:'#5a6a85', fontWeight:'bold'}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {celebrations.map((cel) => (
                <TableRow key={cel._id}>
                  <TableCell sx={{color:'#5a6a85'}}>{cel.title}</TableCell>
                  <TableCell sx={{color:'#5a6a85'}}>{cel.userId?.name || 'Unknown'}</TableCell>
                  <TableCell sx={{color:'#5a6a85'}}>{new Date(cel.eventDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{color:'#5a6a85'}}>{new Date(cel.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/celebration/${cel._id}`)}
                      sx={{
                        marginRight:1,
                        background: '#92A8D1',
                        color: '#fff',
                        textTransform:'none',
                        borderRadius:'12px',
                        '&:hover':{
                          background: '#7a91c4'
                        }
                      }}
                    >
                      View
                    </Button>
                    <Button 
                      variant="outlined"
                      size="small"
                      onClick={() => handleDeleteCelebration(cel._id)}
                      sx={{
                        borderColor: '#F7CAC9',
                        color: '#F7CAC9',
                        textTransform:'none',
                        borderRadius:'12px',
                        '&:hover':{
                          borderColor: '#e5b3b2',
                          background: 'rgba(247, 202, 201, 0.1)'
                        }
                      }}
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
