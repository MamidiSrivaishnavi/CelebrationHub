import { Box, Button, TextField, Typography } from '@mui/material';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreateCelebration = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:5000/celebrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: user._id, 
          title, 
          message, 
          eventDate 
        }),
      });

      const data = await res.json();
      alert("Celebration created!");
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      alert("Failed to create");
    }
  };

  return (
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, marginTop:10}}>

      <Typography variant='h4' sx={{color:'#1976d2', fontWeight:'bold'}}>
        Create Celebration
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

      <Button variant='contained' onClick={handleCreate}>
        Create
      </Button>

      <Button onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>

    </Box>
  )
}

export default CreateCelebration;
