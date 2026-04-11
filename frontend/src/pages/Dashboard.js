import { Box, Typography, Button, Card, CardContent, CardMedia } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [celebrations, setCelebrations] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchCelebrations();
  }, [user, navigate]);

  const fetchCelebrations = async () => {
    try {
      const res = await fetch("http://localhost:5000/celebrations");
      const data = await res.json();
      
      const fixedData = data.map(cel => ({
        ...cel,
        images: cel.images?.map(img => 
          img.startsWith('http') ? img : `http://localhost:5000/${img.replace(/\\/g, '/')}`
        ) || []
      }));
      
      setCelebrations(fixedData);
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
    return null;
  }

  return (
    <Box sx={{padding: { xs: 2, sm: 3, md: 4 }, minHeight:'100vh'}}>
      <Typography variant='h4' sx={{
        color:'#5a6a85', 
        fontWeight:'bold', 
        marginBottom: { xs: 2, sm: 4 },
        fontSize: { xs: '1.75rem', sm: '2.125rem' }
      }}>
        Welcome, {user.name}!
      </Typography>

      <Button 
        variant='contained' 
        sx={{
          marginBottom:4,
          background: '#92A8D1',
          color: '#fff',
          textTransform:'none',
          fontWeight:600,
          borderRadius:'20px',
          padding:'10px 24px',
          boxShadow: '0 4px 20px rgba(146, 168, 209, 0.3)',
          '&:hover':{
            background: '#7a91c4',
            boxShadow: '0 6px 30px rgba(146, 168, 209, 0.4)',
            transform:'translateY(-2px)',
            transition:'all 0.3s ease'
          }
        }} 
        onClick={() => navigate('/create')}
      >
        Create Celebration
      </Button>

      <Typography variant='h6' sx={{marginBottom:3, color:'#5a6a85'}}>
        Your Celebrations
      </Typography>

      {celebrations.filter(cel => cel.userId === user._id).length === 0 ? (
        <Typography sx={{color:'#5a6a85'}}>No celebrations yet</Typography>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)'
          }, 
          gap: { xs: 2, sm: 3 }
        }}>
          {celebrations
            .filter(cel => cel.userId === user._id)
            .map((cel) => (
            <Card key={cel._id} sx={{
              display:'flex', 
              flexDirection:'column',
              borderRadius: { xs: '12px', sm: '16px' },
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(146, 168, 209, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(146, 168, 209, 0.25)'
              }
            }}>
              <CardMedia
                component="img"
                sx={{ height: { xs: 180, sm: 200 }, objectFit: 'cover', backgroundColor: '#f0f0f0' }}
                image={cel.images?.[0] || ''}
                alt={cel.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <Box sx={{
                height: { xs: 180, sm: 200 },
                display: 'none',
                background: 'linear-gradient(135deg, #F7CAC9 0%, #92A8D1 100%)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: { xs: '3rem', sm: '4rem' }
              }}>
                🎉
              </Box>
              <CardContent sx={{flexGrow:1, display:'flex', flexDirection:'column', padding: { xs: 2, sm: 2 }}}>
                <Typography variant='h6' sx={{
                  marginBottom:1, 
                  color:'#5a6a85',
                  fontWeight:600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  {cel.title}
                </Typography>
                <Typography variant='body2' sx={{
                  marginBottom:2, 
                  color:'#5a6a85',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  fontSize: { xs: '0.875rem', sm: '0.875rem' }
                }}>
                  {cel.message}
                </Typography>
                <Typography variant='caption' sx={{color:'#5a6a85', fontSize: { xs: '0.75rem', sm: '0.75rem' }}}>
                  📅 {new Date(cel.eventDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <Box sx={{padding: { xs: 1.5, sm: 2 }, paddingTop:0, display:'flex', gap:1, flexWrap:'wrap'}}>
                <Button 
                  variant='contained' 
                  size='small'
                  onClick={() => navigate(`/celebration/${cel._id}`)}
                  sx={{
                    flex: 1,
                    minWidth: '80px',
                    background: '#92A8D1',
                    color: '#fff',
                    textTransform:'none',
                    borderRadius: { xs: '8px', sm: '12px' },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '&:hover':{
                      background: '#7a91c4'
                    }
                  }}
                >
                  View
                </Button>
                <Button 
                  variant='outlined' 
                  size='small'
                  onClick={() => navigate(`/edit/${cel._id}`)}
                  sx={{
                    flex: 1,
                    minWidth: '80px',
                    borderColor: '#92A8D1',
                    color: '#92A8D1',
                    textTransform:'none',
                    borderRadius: { xs: '8px', sm: '12px' },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '&:hover':{
                      borderColor: '#7a91c4',
                      background: 'rgba(146, 168, 209, 0.1)'
                    }
                  }}
                >
                  Edit
                </Button>
                <Button 
                  variant='outlined' 
                  size='small'
                  onClick={() => handleDelete(cel._id)}
                  sx={{
                    flex: 1,
                    minWidth: '80px',
                    borderColor: '#F7CAC9',
                    color: '#F7CAC9',
                    textTransform:'none',
                    borderRadius: { xs: '8px', sm: '12px' },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '&:hover':{
                      borderColor: '#e5b3b2',
                      background: 'rgba(247, 202, 201, 0.1)'
                    }
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default Dashboard;
