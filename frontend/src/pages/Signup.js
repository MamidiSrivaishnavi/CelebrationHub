import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role: "user" }),
      });

      const data = await res.json();
      console.log(data);
      alert("Signup successful!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, marginTop:10}}>

      <Typography variant='h4' sx={{color:'#1976d2', fontWeight:'bold'}}>
        Signup
      </Typography>

      <TextField 
        label='Name' 
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{width:'300px'}} 
      />

      <TextField 
        label='Email' 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{width:'300px'}} 
      />

      <TextField 
        label='Password' 
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{width:'300px'}} 
      />

      <Button variant='contained' onClick={handleSignup}>
        Signup
      </Button>

      <Typography sx={{marginTop:2}}>
        Already have an account? <a href="/" style={{color:'#1976d2'}}>Login</a>
      </Typography>

    </Box>
  )
}

export default Signup;
