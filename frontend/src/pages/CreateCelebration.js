import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreateCelebration = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('00:00');
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [audio, setAudio] = useState(null);
  const [audioStartTime, setAudioStartTime] = useState(0);
  const [video, setVideo] = useState(null);
  const [theme, setTheme] = useState('seventeen');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('title', title);
      formData.append('message', message);
      formData.append('eventDate', eventDate);
      formData.append('eventTime', eventTime);
      formData.append('audioStartTime', audioStartTime);
      formData.append('theme', theme);

      // Add images
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }

      // Add audio
      if (audio) {
        formData.append('audio', audio);
      }

      // Add video
      if (video) {
        formData.append('video', video);
      }

      const res = await fetch("http://localhost:5000/celebrations", {
        method: "POST",
        body: formData,
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
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, marginTop:5, paddingBottom:5}}>

      <Typography variant='h4' sx={{color:'#1976d2', fontWeight:'bold'}}>
        Create Celebration
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
        <Typography variant='body2' sx={{marginBottom:1}}>Upload Images (multiple)</Typography>
        <input 
          type='file' 
          accept='image/png,image/jpeg,image/jpg,image/gif,image/webp,image/bmp' 
          multiple
          onChange={(e) => {
            const filesArray = Array.from(e.target.files);
            setImageFiles(filesArray);
            setImages(filesArray.map(file => URL.createObjectURL(file)));
          }}
        />
        {images.length > 0 && (
          <Box sx={{display:'flex', flexWrap:'wrap', gap:1, marginTop:2}}>
            {images.map((img, index) => (
              <Box key={index} sx={{position:'relative'}}>
                <img src={img} alt={`preview-${index}`} style={{width:'80px', height:'80px', objectFit:'cover', borderRadius:'4px'}} />
                <Button
                  size='small'
                  onClick={() => {
                    const newImages = images.filter((_, i) => i !== index);
                    const newFiles = imageFiles.filter((_, i) => i !== index);
                    setImages(newImages);
                    setImageFiles(newFiles);
                  }}
                  sx={{position:'absolute', top:-8, right:-8, minWidth:'24px', width:'24px', height:'24px', borderRadius:'50%', background:'red', color:'white', padding:0, fontSize:'12px'}}
                >
                  ✕
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{width:'400px'}}>
        <Typography variant='body2' sx={{marginBottom:1}}>Upload Background Music</Typography>
        <input 
          type='file' 
          accept='audio/*'
          onChange={(e) => setAudio(e.target.files[0])}
        />
        {audio && (
          <Box sx={{marginTop:2}}>
            <Box sx={{display:'flex', alignItems:'center', gap:1, marginBottom:1}}>
              <Typography variant='caption'>🎵 {audio.name}</Typography>
              <Button
                size='small'
                onClick={() => setAudio(null)}
                sx={{minWidth:'24px', width:'24px', height:'24px', borderRadius:'50%', background:'red', color:'white', padding:0, fontSize:'12px'}}
              >
                ✕
              </Button>
            </Box>
            <TextField
              label='Start music (seconds before event)'
              type='number'
              value={audioStartTime}
              onChange={(e) => setAudioStartTime(e.target.value)}
              sx={{width:'100%'}}
              helperText='Example: 14 means music starts 14 seconds before 00:00:00'
            />
          </Box>
        )}
      </Box>

      <Box sx={{width:'400px'}}>
        <Typography variant='body2' sx={{marginBottom:1}}>Upload Video</Typography>
        <input 
          type='file' 
          accept='video/*'
          onChange={(e) => setVideo(e.target.files[0])}
        />
        {video && (
          <Box sx={{display:'flex', alignItems:'center', gap:1, marginTop:1}}>
            <Typography variant='caption'>🎬 {video.name}</Typography>
            <Button
              size='small'
              onClick={() => setVideo(null)}
              sx={{minWidth:'24px', width:'24px', height:'24px', borderRadius:'50%', background:'red', color:'white', padding:0, fontSize:'12px'}}
            >
              ✕
            </Button>
          </Box>
        )}
      </Box>

      <Button variant='contained' onClick={handleCreate}>
        Create Celebration
      </Button>

      <Button onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>

    </Box>
  )
}

export default CreateCelebration;
