import { Box, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AllCelebrations = () => {
  const [celebrations, setCelebrations] = useState([]);
  const navigate = useNavigate();

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

  return (
    <Box sx={{padding:4}}>
      <Typography variant='h4' sx={{color:'#1976d2', fontWeight:'bold', marginBottom:4, textAlign:'center'}}>
        All Celebrations 🎉
      </Typography>

      <Grid container spacing={3}>
        {celebrations.map((cel) => (
          <Grid item xs={12} sm={6} md={4} key={cel._id}>
            <Card sx={{height:'100%', display:'flex', flexDirection:'column', cursor:'pointer'}} onClick={() => navigate(`/celebration/${cel._id}`)}>
              {cel.images?.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={cel.images[0]}
                  alt={cel.title}
                  sx={{objectFit:'cover'}}
                />
              )}
              <CardContent sx={{flexGrow:1}}>
                <Typography variant='h6' sx={{marginBottom:1}}>{cel.title}</Typography>
                <Typography variant='body2' color='text.secondary' sx={{marginBottom:1}}>
                  {cel.message.substring(0, 100)}...
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  📅 {new Date(cel.eventDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <Box sx={{padding:2}}>
                <Button variant='contained' fullWidth>
                  View Celebration
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {celebrations.length === 0 && (
        <Typography sx={{textAlign:'center', marginTop:4}}>No celebrations yet</Typography>
      )}
    </Box>
  );
};

export default AllCelebrations;
