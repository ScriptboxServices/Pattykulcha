'use client';

import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

interface KulchaCardProps {
  title: string;
  selected: boolean;
}

const KulchaCard: React.FC<KulchaCardProps> = ({ title, selected }) => {
  return (
    <Card variant="outlined" sx={{ width: '100%', position: 'relative' }}>
      {selected && <CheckCircle sx={{ position: 'absolute', top: 8, right: 8, color: 'primary.main' }} />}
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <img src="/images/checkout/checkout2.png" alt={`${title}} style={{ width: '150px', height: '150px' }`} />
          <Typography variant="h6" align="center">{title}</Typography>
          <Button variant="outlined" sx={{ marginTop: 1 }}>Add</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const RecommendationSlider: React.FC = () => {
  const kulchas = [
    { title: 'Panner Kulcha', selected: true },
    { title: 'Masala Kulcha', selected: false },
    { title: 'Chole Kulcha', selected: false },
    { title: 'Aloo Kulcha', selected: false },
    { title: 'Onion Kulcha', selected: false },
  ];

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 3, spacing: 10 },
      },
      '(max-width: 767px)': {
        slides: { perView: 1, spacing: 10 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    }
  });

  return (
    <Box sx={{ backgroundColor: '#FAF3E0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: 'black' }} gutterBottom>
        YOU MAY ALSO LIKE
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 1200, mt: 5 }}>
        {loaded && instanceRef.current && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              instanceRef.current?.prev();
            }}
            disabled={currentSlide == 0}
          >
            <ArrowBack />
          </IconButton>
        )}
        <Box ref={sliderRef} className="keen-slider" sx={{ width: '100%' }}>
          {kulchas.map((kulcha, index) => (
            <div className="keen-slider__slide" key={index}>
              <KulchaCard title={kulcha.title} selected={kulcha.selected} />
            </div>
          ))}
        </Box>
        {loaded && instanceRef.current && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              instanceRef.current?.next();
            }}
            disabled={currentSlide == instanceRef.current.track.details.slides.length - 3}
          >
            <ArrowForward />
          </IconButton>
        )}
      </Box>
      {loaded && instanceRef.current && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          {Array.from({ length: instanceRef.current.track.details.slides.length }).map((_, idx) => (
            <Box
              key={idx}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: currentSlide == idx ? 'primary.main' : 'grey.400',
                margin: '0 4px',
                cursor: 'pointer',
              }}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecommendationSlider;