import React from 'react';
import { Box, Container, Grid, Typography, Button, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TikTokIcon from '@mui/icons-material/MusicNote';

const Footer: React.FC = () => {

  return (
    <Box component="footer" sx={{ bgcolor: '#162548', color: 'white', py: 2 }}>
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            mt: 2, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2, width:'100%'}}>
            <Link href="https://www.facebook.com/people/PattyKulcha/61564745060670/" target="_blank" color="inherit" sx={{ mx: 1, fontSize: '1.5rem' }}><FacebookIcon /></Link>
            <Link href="https://x.com/pattykulcha" color="inherit" target="_blank" sx={{ mx: 1, fontSize: '1.5rem' }}><TwitterIcon /></Link>
            <Link href="https://www.instagram.com/pattykulcha/?utm_source=ig_web_button_share_sheet" target="_blank" color="inherit" sx={{ mx: 1, fontSize: '1.5rem' }}><InstagramIcon /></Link>
            <Link href="https://www.linkedin.com/in/pattykulcha/" target="_blank" color="inherit" sx={{ mx: 1, fontSize: '1.5rem' }}><LinkedInIcon /></Link>
            <Link href="https://www.tiktok.com/@pattykulcha" color="inherit" sx={{ mx: 1, fontSize: '1.5rem' }}><TikTokIcon /></Link>
          </Box>
        </Box>
        <Box 
          sx={{ 
            mt: 2, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <Typography variant="body2" sx={{ textAlign: { xs: 'center', md: 'right',width:'100%' } }}>
            © 2024 All Rights Reserved
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, textAlign: { xs: 'center', md: 'right',width:'100%',mb:4 } }}>
          <Link href="/privacypolicy" color="inherit" underline="hover">
            Privacy Policy
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;