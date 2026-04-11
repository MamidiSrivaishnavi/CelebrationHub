import { Box, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AllCelebrations = () => {
  const [celebrations, setCelebrations] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
      
      // Fix local file paths
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

  return (
    <Box sx={{padding: { xs: 2, sm: 3, md: 4 }, minHeight:'100vh'}}>
      <Typography variant='h4' sx={{
        color:'#5a6a85', 
        fontWeight:'bold', 
        marginBottom: { xs: 3, sm: 4 }, 
        textAlign:'center',
        fontSize: { xs: '1.75rem', sm: '2.125rem' }
      }}>
        All Celebrations 🎉
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)', 
          lg: 'repeat(4, 1fr)' 
        }, 
        gap: { xs: 2, sm: 3 }
      }}>
        {celebrations.map((cel) => (
          <Card key={cel._id} sx={{
            display:'flex', 
            flexDirection:'column',
            cursor:'pointer',
            borderRadius: { xs: '12px', sm: '16px' },
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(146, 168, 209, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(146, 168, 209, 0.25)'
            }
          }} onClick={() => navigate(`/celebration/${cel._id}`)}>
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
            <CardContent sx={{flexGrow:1, display:'flex', flexDirection:'column', minHeight: { xs: 120, sm: 140 }, padding: { xs: 2, sm: 2 }}}>
              <Typography variant='h6' sx={{
                marginBottom:1, 
                color:'#5a6a85',
                fontWeight:600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: { xs: 40, sm: 48 },
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                {cel.title}
              </Typography>
              <Typography variant='body2' sx={{
                marginBottom:2, 
                color:'#5a6a85',
                flexGrow:1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                fontSize: { xs: '0.875rem', sm: '0.875rem' }
              }}>
                {cel.message}
              </Typography>
              <Typography variant='caption' sx={{color:'#5a6a85', marginTop:'auto', fontSize: { xs: '0.75rem', sm: '0.75rem' }}}>
                📅 {new Date(cel.eventDate).toLocaleDateString()}
              </Typography>
            </CardContent>
            <Box sx={{padding: { xs: 1.5, sm: 2 }, paddingTop:0}}>
              <Button 
                variant='contained' 
                fullWidth
                sx={{
                  background: '#92A8D1',
                  color: '#fff',
                  textTransform:'none',
                  fontWeight:600,
                  borderRadius: { xs: '8px', sm: '12px' },
                  padding: { xs: '8px', sm: '10px' },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '&:hover':{
                    background: '#7a91c4'
                  }
                }}
              >
                View Celebration
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      {celebrations.length === 0 && (
        <Typography sx={{textAlign:'center', marginTop:4, color:'#5a6a85'}}>No celebrations yet</Typography>
      )}
    </Box>
  );
};

export default AllCelebrations;
