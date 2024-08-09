import React from 'react';
import { Box, Container, Grid, Typography, Button, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TikTokIcon from '@mui/icons-material/MusicNote';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'About',
      items: ['Locations', 'Gift Cards', 'Fundraising', 'Goodness Guarantee', 'Nourish & Inspire', 'We Care', 'Animal Welfare', 'Executive Bios', 'Foundation', 'Real Estate', 'Investor Relations'],
    },
    {
      title: 'Our Food',
      items: ['Catering', 'Eat Well', 'LEANguini', 'Zoodles', 'Impossible Panko Chicken', 'Mac Bar'],
    },
    {
      title: 'Franchising',
      items: ['Why Noodles?', 'What You Get', 'Ideal Partner Criteria', 'Markets'],
    },
    {
      title: 'Company Info',
      items: ['Contact Us', 'Careers - Apply Now', 'Our Benefits', 'W-2 Address Changes', 'FAQs', 'Newsroom'],
    },
  ];

  return (
    <Box component="footer" sx={{ bgcolor: '#162548', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {footerSections.map((section) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3} 
              key={section.title} 
              sx={{
                textAlign: { xs: 'center', md: 'left' }, 
                mb: { xs: 2, md: 0 }
              }}
            >
              <Typography 
                variant="h6" 
                color="primary.light" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                {section.title}
              </Typography>
              {section.items.map((item) => (
                <Typography 
                  variant="body2" 
                  key={item} 
                  sx={{ 
                    my: 0.5,
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  <Link href="#" color="inherit" underline="hover">
                    {item}
                  </Link>
                </Typography>
              ))}
            </Grid>
          ))}
        </Grid>
        <Box 
          sx={{ 
            mt: 4, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ 
              color: 'white', 
              borderColor: 'white', 
              px: 3, 
              py: 1, 
              fontWeight: 'bold',
              mb: { xs: 2, md: 0 }
            }}
          >
            Join Today
          </Button>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
            <Link href="#" color="inherit" sx={{ mx: 1, fontSize: '1.5rem' }}><FacebookIcon /></Link>
            <Link href="#" color="inherit" sx={{ mx: 1, fontSize: '1.5rem' }}><TwitterIcon /></Link>
            <Link href="#" color="inherit" sx={{ mx: 1, fontSize: '1.5rem' }}><InstagramIcon /></Link>
            <Link href="#" color="inherit" sx={{ mx: 1, fontSize: '1.5rem' }}><LinkedInIcon /></Link>
            <Link href="#" color="inherit" sx={{ mx: 1, fontSize: '1.5rem' }}><TikTokIcon /></Link>
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
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2, mb: { xs: 2, md: 0 } }}>
            <img src="/images/footer/image2.jpg" alt="Get it on Google Play" style={{ height: 40 }} />
            <img src="/images/footer/image1.png" alt="Download on the App Store" style={{ height: 40 }} />
          </Box>
          <Typography variant="body2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            © 2024 All Rights Reserved
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="#" color="inherit" underline="hover">
            Privacy Policy
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;