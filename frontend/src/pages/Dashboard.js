import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [celebrations, setCelebrations] = useState([]);

  useEffect(() => {
    fetchCelebrations();
  }, []);

  const fetchCelebrations = async () => {
    try {
      const res = await fetch("http://localhost:5000/celebrations");
      const data = await res.json();
      setCelebrations(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/celebrations/${id}`, {
        method: "DELETE",
      });
      alert("Deleted!");
      fetchCelebrations();
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <Box sx={{padding:4}}>
      <Typography variant='h4' sx={{color:'#1976d2', fontWeight:'bold', marginBottom:4}}>
        Welcome, {user.name}!
      </Typography>

      <Button variant='contained' sx={{marginBottom:4}} onClick={() => navigate('/create')}>
        Create Celebration
      </Button>

      <Typography variant='h6' sx={{marginBottom:2}}>
        Your Celebrations
      </Typography>

      {celebrations.length === 0 ? (
        <Typography>No celebrations yet</Typography>
      ) : (
        celebrations.map((cel) => (
          <Card key={cel._id} sx={{marginBottom:2, maxWidth:600}}>
            <CardContent>
              <Typography variant='h6'>{cel.title}</Typography>
              <Typography>{cel.message}</Typography>
              <Typography variant='caption'>Date: {cel.eventDate}</Typography>
              <Box sx={{marginTop:2}}>
                <Button 
                  variant='contained' 
                  size='small'
                  onClick={() => navigate(`/celebration/${cel._id}`)}
                  sx={{marginRight:1}}
                >
                  View
                </Button>
                <Button 
                  variant='outlined' 
                  size='small'
                  onClick={() => navigate(`/edit/${cel._id}`)}
                  sx={{marginRight:1}}
                >
                  Edit
                </Button>
                <Button 
                  variant='outlined' 
                  color='error' 
                  size='small'
                  onClick={() => handleDelete(cel._id)}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  )
}

export default Dashboard;
