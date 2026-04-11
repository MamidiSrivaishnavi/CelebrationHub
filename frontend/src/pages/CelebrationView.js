import { Box, Button, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

const CelebrationView = () => {
  const { id } = useParams();
  const [celebration, setCelebration] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [isEventTime, setIsEventTime] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const themes = {
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    blue: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
    pink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    green: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    dark: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    seventeen: 'linear-gradient(135deg, #F7CAC9 0%, #92A8D1 100%)'
  };

  useEffect(() => {
    fetchCelebration();
  }, [id]);

  const fetchCelebration = async () => {
    try {
      const res = await fetch(`http://localhost:5000/celebrations/${id}`);
      const data = await res.json();
      setCelebration(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!celebration) return;

    const timer = setInterval(() => {
      const targetDateTime = new Date(`${celebration.eventDate.split('T')[0]}T${celebration.eventTime}`);
      const now = new Date();
      const diff = targetDateTime - now;

      if (diff <= 0 && !isEventTime) {
        setIsEventTime(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        triggerConfetti();
        clearInterval(timer);
      } else if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });

        // Auto-start music at specified time with correct position (only if countdown is active)
        if (celebration.audio && !musicStarted && diff <= celebration.audioStartTime * 1000) {
          const elapsedTime = celebration.audioStartTime - (diff / 1000);
          if (audioRef.current) {
            audioRef.current.currentTime = elapsedTime;
            audioRef.current.play();
            setIsPlaying(true);
          }
          setMusicStarted(true);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [celebration, isEventTime, musicStarted]);

  useEffect(() => {
    if (!celebration?.images?.length) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % celebration.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [celebration]);

  const triggerConfetti = () => {
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleAudioToggle = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!celebration) {
    return <Typography sx={{textAlign:'center', marginTop:10}}>Loading...</Typography>;
  }

  return (
    <Box sx={{
      minHeight:'100vh',
      background: themes[celebration.theme] || themes.seventeen,
      padding:4,
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      color:'white'
    }}>
      
      <Typography variant='h3' sx={{fontWeight:'bold', marginBottom:3, textAlign:'center'}}>
        {celebration.title}
      </Typography>

      {!isEventTime ? (
        <Box sx={{textAlign:'center', marginBottom:4}}>
          <Typography variant='h5' sx={{marginBottom:2}}>Countdown</Typography>
          <Box sx={{display:'flex', gap:3, justifyContent:'center'}}>
            <Box>
              <Typography variant='h2' sx={{fontWeight:'bold'}}>{timeLeft.days || 0}</Typography>
              <Typography>Days</Typography>
            </Box>
            <Box>
              <Typography variant='h2' sx={{fontWeight:'bold'}}>{timeLeft.hours || 0}</Typography>
              <Typography>Hours</Typography>
            </Box>
            <Box>
              <Typography variant='h2' sx={{fontWeight:'bold'}}>{timeLeft.minutes || 0}</Typography>
              <Typography>Minutes</Typography>
            </Box>
            <Box>
              <Typography variant='h2' sx={{fontWeight:'bold'}}>{timeLeft.seconds || 0}</Typography>
              <Typography>Seconds</Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Typography variant='h4' sx={{marginBottom:3, fontWeight:'bold'}}>
            🎉 It's Time to Celebrate! 🎉
          </Typography>

          {celebration.images?.length > 0 && (
            <Box sx={{
              width:'600px',
              height:'400px',
              borderRadius:2,
              overflow:'hidden',
              marginBottom:3,
              boxShadow:'0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <img
                src={`http://localhost:5000/${celebration.images[currentImageIndex]}`}
                alt='celebration'
                style={{width:'100%', height:'100%', objectFit:'cover'}}
              />
            </Box>
          )}

          {celebration.video && (
            <Box sx={{marginBottom:3}}>
              <video
                src={`http://localhost:5000/${celebration.video}`}
                controls
                style={{width:'600px', borderRadius:'8px', boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}
              />
            </Box>
          )}

          <Box sx={{
            background:'rgba(255,255,255,0.1)',
            padding:3,
            borderRadius:2,
            maxWidth:'600px',
            marginBottom:3,
            backdropFilter:'blur(10px)'
          }}>
            <Typography variant='h6' sx={{marginBottom:1}}>Message:</Typography>
            <Typography sx={{fontSize:'1.1rem', lineHeight:1.6}}>
              {celebration.message}
            </Typography>
          </Box>
        </>
      )}

      {celebration.audio && (
        <Box>
          <audio ref={audioRef} loop>
            <source src={`http://localhost:5000/${celebration.audio}`} type='audio/mpeg' />
          </audio>
          <Button
            variant='contained'
            onClick={handleAudioToggle}
            sx={{background:'rgba(255,255,255,0.2)', '&:hover':{background:'rgba(255,255,255,0.3)'}}}
          >
            {isPlaying ? '⏸️ Pause Music' : '🔊 Play Music'}
          </Button>
        </Box>
      )}

    </Box>
  );
};

export default CelebrationView;
