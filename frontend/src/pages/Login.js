import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, marginTop:10}}>

      <Typography variant='h4' sx={{color:'#1976d2', fontWeight:'bold'}}>
        Login
      </Typography>

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

      <Button variant='contained' onClick={handleLogin}>
        Login
      </Button>

    </Box>
  )
}

export default Login;