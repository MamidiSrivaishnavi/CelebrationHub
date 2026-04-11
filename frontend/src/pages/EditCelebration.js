import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditCelebration = () => {
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
  const [existingData, setExistingData] = useState(null);
  const [selectedExistingImages, setSelectedExistingImages] = useState([]);
  const [keepExistingAudio, setKeepExistingAudio] = useState(true);
  const [keepExistingVideo, setKeepExistingVideo] = useState(true);
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
      setSelectedExistingImages(data.images || []);
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

      // Send selected existing images
      formData.append('keepExistingImages', JSON.stringify(selectedExistingImages));

      // Add new images if uploaded
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }

      // Add new audio if uploaded, or mark for removal
      if (audio) {
        formData.append('audio', audio);
      } else if (!keepExistingAudio) {
        formData.append('removeAudio', 'true');
      }

      // Add new video if uploaded, or mark for removal
      if (video) {
        formData.append('video', video);
      } else if (!keepExistingVideo) {
        formData.append('removeVideo', 'true');
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
        <Typography variant='body2' sx={{marginBottom:1}}>Images</Typography>
        
        {existingData?.images?.length > 0 && (
          <Box>
            <Typography variant='caption' sx={{display:'block', marginBottom:1, color:'#666'}}>
              Click on images to remove them
            </Typography>
            <Box sx={{display:'flex', flexWrap:'wrap', gap:1, marginBottom:2}}>
              {existingData.images.map((img, index) => {
                const isSelected = selectedExistingImages.includes(img);
                return (
                  <Box 
                    key={index} 
                    onClick={() => {
                      if (isSelected) {
                        setSelectedExistingImages(selectedExistingImages.filter(i => i !== img));
                      } else {
                        setSelectedExistingImages([...selectedExistingImages, img]);
                      }
                    }}
                    sx={{cursor:'pointer', position:'relative'}}
                  >
                    <img 
                      src={img} 
                      alt={`existing-${index}`} 
                      style={{
                        width:'80px', 
                        height:'80px', 
                        objectFit:'cover', 
                        borderRadius:'4px', 
                        border: isSelected ? '2px solid #1976d2' : '2px solid red',
                        opacity: isSelected ? 1 : 0.5
                      }} 
                    />
                    {!isSelected && (
                      <Box sx={{
                        position:'absolute',
                        top:0,
                        left:0,
                        right:0,
                        bottom:0,
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        background:'rgba(255,0,0,0.3)',
                        borderRadius:'4px'
                      }}>
                        <Typography sx={{color:'white', fontSize:'24px', fontWeight:'bold'}}>✕</Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        <Typography variant='body2' sx={{marginBottom:1}}>Add new images</Typography>
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
        <Typography variant='body2' sx={{marginBottom:1}}>Background Music</Typography>
        
        {existingData?.audio && keepExistingAudio && (
          <Box sx={{marginBottom:2}}>
            <Typography variant='caption' sx={{display:'block', marginBottom:1, color:'#666'}}>
              Click to remove: 🎵 {existingData.audio.split('/').pop()}
            </Typography>
            <Box onClick={() => setKeepExistingAudio(false)} sx={{cursor:'pointer'}}>
              <audio controls style={{width:'100%', height:'40px', pointerEvents:'none'}}>
                <source src={existingData.audio} type='audio/mpeg' />
              </audio>
            </Box>
          </Box>
        )}

        {!keepExistingAudio && existingData?.audio && (
          <Box sx={{marginBottom:2}}>
            <Typography variant='caption' sx={{color:'red'}}>
              ✕ Existing audio will be removed
            </Typography>
            <Button size='small' onClick={() => setKeepExistingAudio(true)} sx={{marginLeft:1}}>
              Undo
            </Button>
          </Box>
        )}

        <Typography variant='body2' sx={{marginBottom:1}}>Add new audio</Typography>
        <input 
          type='file' 
          accept='audio/*'
          onChange={(e) => setAudio(e.target.files[0])}
        />
        {audio && (
          <Box sx={{display:'flex', alignItems:'center', gap:1, marginTop:1}}>
            <Typography variant='caption'>🎵 {audio.name}</Typography>
            <Button
              size='small'
              onClick={() => setAudio(null)}
              sx={{minWidth:'24px', width:'24px', height:'24px', borderRadius:'50%', background:'red', color:'white', padding:0, fontSize:'12px'}}
            >
              ✕
            </Button>
          </Box>
        )}
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
        <Typography variant='body2' sx={{marginBottom:1}}>Video</Typography>
        
        {existingData?.video && keepExistingVideo && (
          <Box sx={{marginBottom:2}}>
            <Typography variant='caption' sx={{display:'block', marginBottom:1, color:'#666'}}>
              Click to remove: 🎬 {existingData.video.split('/').pop()}
            </Typography>
            <Box onClick={() => setKeepExistingVideo(false)} sx={{cursor:'pointer'}}>
              <video controls style={{width:'100%', maxHeight:'200px', borderRadius:'8px', pointerEvents:'none'}}>
                <source src={existingData.video} type='video/mp4' />
              </video>
            </Box>
          </Box>
        )}

        {!keepExistingVideo && existingData?.video && (
          <Box sx={{marginBottom:2}}>
            <Typography variant='caption' sx={{color:'red'}}>
              ✕ Existing video will be removed
            </Typography>
            <Button size='small' onClick={() => setKeepExistingVideo(true)} sx={{marginLeft:1}}>
              Undo
            </Button>
          </Box>
        )}

        <Typography variant='body2' sx={{marginBottom:1}}>Add new video</Typography>
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
