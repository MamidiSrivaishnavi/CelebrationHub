import { Box, Button, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditCelebration = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCelebration();
  }, []);

  const fetchCelebration = async () => {
    try {
      const res = await fetch(`http://localhost:5000/celebrations`);
      const data = await res.json();
      const celebration = data.find(c => c._id === id);
      if (celebration) {
        setTitle(celebration.title);
        setMessage(celebration.message);
        setEventDate(celebration.eventDate);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:5000/celebrations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, message, eventDate }),
      });
      alert("Updated!");
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      alert("Failed to update");
    }
  };

  return (
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, marginTop:10}}>

      <Typography variant='h4' sx={{color:'#1976d2', fontWeight:'bold'}}>
        Edit Celebration
      </Typography>

      <TextField 
        label='Title' 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{width:'300px'}} 
      />

      <TextField 
        label='Message' 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{width:'300px'}} 
        multiline
        rows={3}
      />

      <TextField 
        label='Event Date' 
        type='date'
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        sx={{width:'300px'}}
        InputLabelProps={{ shrink: true }}
      />

      <Button variant='contained' onClick={handleUpdate}>
        Update
      </Button>

      <Button onClick={() => navigate('/dashboard')}>
        Cancel
      </Button>

    </Box>
  )
}

export default EditCelebration;
