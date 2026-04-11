import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditCelebration = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('00:00');
  const [images, setImages] = useState([]);
  const [audio, setAudio] = useState(null);
  const [audioStartTime, setAudioStartTime] = useState(0);
  const [video, setVideo] = useState(null);
  const [theme, setTheme] = useState('seventeen');
  const [existingData, setExistingData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCelebration();
  }, []);

  const fetchCelebration = async () => {
    try {
      const res = await fetch(`http://localhost:5000/celebrations/${id}`);
      const data = await res.json();
      setTitle(data.title);
      setMessage(data.message);
      setEventDate(data.eventDate.split('T')[0]);
      setEventTime(data.eventTime || '00:00');
      setAudioStartTime(data.audioStartTime || 0);
      setTheme(data.theme || 'seventeen');
      setExistingData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('message', message);
      formData.append('eventDate', eventDate);
      formData.append('eventTime', eventTime);
      formData.append('audioStartTime', audioStartTime);
      formData.append('theme', theme);

      // Add new images if uploaded
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }

      // Add new audio if uploaded
      if (audio) {
        formData.append('audio', audio);
      }

      // Add new video if uploaded
      if (video) {
        formData.append('video', video);
      }

      await fetch(`http://localhost:5000/celebrations/${id}`, {
        method: "PUT",
        body: formData,
      });
      alert("Updated!");
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      alert("Failed to update");
    }
  };

  return (
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, marginTop:5, paddingBottom:5}}>

      <Typography variant='h4' sx={{color:'#1976d2', fontWeight:'bold'}}>
        Edit Celebration
      </Typography>

      <TextField 
        label='Title' 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{width:'400px'}} 
      />

      <TextField 
        label='Message' 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{width:'400px'}} 
        multiline
        rows={5}
      />

      <TextField 
        label='Event Date' 
        type='date'
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        sx={{width:'400px'}}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label='Event Time'
        type='time'
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
        sx={{width:'400px'}}
        InputLabelProps={{ shrink: true }}
      />

      <FormControl sx={{width:'400px'}}>
        <InputLabel>Theme</InputLabel>
        <Select
          value={theme}
          label='Theme'
          onChange={(e) => setTheme(e.target.value)}
        >
          <MenuItem value='purple'>Purple Gradient</MenuItem>
          <MenuItem value='blue'>Blue Ocean</MenuItem>
          <MenuItem value='pink'>Pink Sunset</MenuItem>
          <MenuItem value='green'>Green Nature</MenuItem>
          <MenuItem value='orange'>Orange Fire</MenuItem>
          <MenuItem value='dark'>Dark Elegance</MenuItem>
          <MenuItem value='seventeen'>Rose Quartz & Serenity</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{width:'400px'}}>
        <Typography variant='body2' sx={{marginBottom:1}}>Replace Images (optional)</Typography>
        {existingData?.images?.length > 0 && (
          <Typography variant='caption' sx={{display:'block', marginBottom:1}}>
            Current: {existingData.images.length} image(s)
          </Typography>
        )}
        <input 
          type='file' 
          accept='image/png,image/jpeg,image/jpg,image/gif,image/webp,image/bmp' 
          multiple
          onChange={(e) => setImages(e.target.files)}
        />
      </Box>

      <Box sx={{width:'400px'}}>
        <Typography variant='body2' sx={{marginBottom:1}}>Replace Background Music (optional)</Typography>
        {existingData?.audio && (
          <Typography variant='caption' sx={{display:'block', marginBottom:1}}>
            Current audio exists
          </Typography>
        )}
        <input 
          type='file' 
          accept='audio/*'
          onChange={(e) => setAudio(e.target.files[0])}
        />
        <TextField
          label='Start music (seconds before event)'
          type='number'
          value={audioStartTime}
          onChange={(e) => setAudioStartTime(e.target.value)}
          sx={{width:'100%', marginTop:2}}
          helperText='Example: 14 means music starts 14 seconds before 00:00:00'
        />
      </Box>

      <Box sx={{width:'400px'}}>
        <Typography variant='body2' sx={{marginBottom:1}}>Replace Video (optional)</Typography>
        {existingData?.video && (
          <Typography variant='caption' sx={{display:'block', marginBottom:1}}>
            Current video exists
          </Typography>
        )}
        <input 
          type='file' 
          accept='video/*'
          onChange={(e) => setVideo(e.target.files[0])}
        />
      </Box>

      <Button variant='contained' onClick={handleUpdate}>
        Update Celebration
      </Button>

      <Button onClick={() => navigate('/dashboard')}>
        Cancel
      </Button>

    </Box>
  )
}

export default EditCelebration;
