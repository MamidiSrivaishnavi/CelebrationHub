import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role: "user" }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      console.log(data);
      alert("Signup successful! Please login.");
      navigate('/');
    } catch (err) {
      console.log(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight:'100vh',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      padding:3
    }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{
          padding:4,
          borderRadius:'24px',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)'
        }}>
          <Box sx={{textAlign:'center', marginBottom:4}}>
            <Typography variant='h4' sx={{
              fontWeight:'bold',
              color: '#5a6a85',
              letterSpacing:'1px',
              marginBottom:1
            }}>
              Join Us! 🎊
            </Typography>
            <Typography variant='body1' sx={{
              color: '#5a6a85',
              fontSize:'1rem'
            }}>
              Create your account to start celebrating
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSignup} sx={{display:'flex', flexDirection:'column', gap:2.5}}>
            <TextField 
              label='Full Name' 
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant='outlined'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius:'12px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  '& fieldset': {
                    borderColor: 'rgba(146, 168, 209, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: '#92A8D1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#92A8D1'
                  }
                }
              }}
            />

            <TextField 
              label='Email' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant='outlined'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius:'12px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  '& fieldset': {
                    borderColor: 'rgba(146, 168, 209, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: '#92A8D1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#92A8D1'
                  }
                }
              }}
            />

            <TextField 
              label='Password' 
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant='outlined'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius:'12px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  '& fieldset': {
                    borderColor: 'rgba(146, 168, 209, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: '#92A8D1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#92A8D1'
                  }
                }
              }}
            />

            <Button 
              type="submit"
              variant='contained' 
              size='large'
              disabled={loading}
              sx={{
                marginTop:1,
                padding:'12px',
                fontSize:'1rem',
                fontWeight:600,
                textTransform:'none',
                borderRadius:'20px',
                background: '#92A8D1',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(146, 168, 209, 0.3)',
                '&:hover':{
                  background: '#7a91c4',
                  boxShadow: '0 6px 30px rgba(146, 168, 209, 0.4)',
                  transform:'translateY(-2px)',
                  transition:'all 0.3s ease'
                },
                '&:disabled': {
                  background: '#ccc',
                  color: '#666'
                }
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Box sx={{textAlign:'center', marginTop:1}}>
              <Typography variant='body2' sx={{color: '#5a6a85'}}>
                Already have an account?{' '}
                <Button 
                  onClick={() => navigate('/')}
                  sx={{
                    textTransform:'none',
                    fontWeight:600,
                    padding:0,
                    minWidth:'auto',
                    color: '#92A8D1',
                    '&:hover':{
                      background:'transparent',
                      color: '#7a91c4'
                    }
                  }}
                >
                  Login
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Signup;
