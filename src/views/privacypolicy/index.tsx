'use client'
import React from 'react';

// MUI Imports
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// Styled Card component for the header
const HeaderCard = styled(Card)({
  backgroundImage: 'url(/images/bgimage.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  padding: '3rem 1rem',
  textAlign: 'center'
});

const ContentCard = styled(Card)(({ theme }) => ({
  marginBottom: '1.5rem',
  padding: '2rem',
  textAlign: 'justify',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

const SectionTitle = styled(Typography)({
  marginBottom: '1rem',
  color: '#333',
  fontWeight: 600
});

const PrivacyPolicyPage = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '2rem 0' }}>
      <HeaderCard elevation={0}>
        <CardContent>
          <Typography variant='h4' component='h1'>
            Privacy Policy
          </Typography>
        </CardContent>
      </HeaderCard>
      <Container maxWidth="md" sx={{paddingY:6}}>
        <ContentCard className=' mt-4'>
          <SectionTitle variant='h5'>
            Information Collection
          </SectionTitle>
          <Typography paragraph>
            <strong>Personal Information:</strong> We collect your personal information involving name, email, address, documents for IRCC account through the forms you submit.
          </Typography>
          <Typography paragraph>
            <strong>Automatically Collected Information:</strong> We also collect information about the interaction of your browsers, and devices with our services, including IP address, cookies, user account that has logged in, and the date, time, and URL of your request.
          </Typography>
          <Typography paragraph>
            <strong>Purchase activity:</strong> We collect your payment information and purchase history details.
          </Typography>
        </ContentCard>
        <ContentCard>
          <SectionTitle variant='h5'>
            Information Use
          </SectionTitle>
          <Typography paragraph>
            <strong>Providing services:</strong> We use your information to provide services which includes updating, securing, and troubleshooting, as well as providing support, processing transactions, and communicating with users.
          </Typography>
          <Typography paragraph>
            <strong>Maintain performance:</strong> We use the data to operate our business, which includes analyzing our performance, developing our workforce, and conducting research.
          </Typography>
          <Typography paragraph>
            <strong>Communication:</strong> We use information we collect, like your email address, to interact with you directly.
          </Typography>
          <Typography component="ul">
            <li>Communicate with you regarding customer service issues.</li>
            <li>Communicate with you about your requests.</li>
          </Typography>
        </ContentCard>
        <ContentCard>
          <SectionTitle variant='h5'>
            Sharing Your Information
          </SectionTitle>
          <Typography component="ul">
            <li>We share your personal data with your consent to complete any transaction or provide certain services you have requested.</li>
            <li>We use service providers to help operate our data centers, improve our business processes, and deliver services to users.</li>
            <li>We disclose your information for legal activities such as enforcing Terms of Services and detecting and preventing fraud.</li>
            <li>We share your grade mark sheets with international credit evaluation organizations to evaluate and convert them to equate the grades to the grading system of the country you apply to.</li>
            <li>We create your application(s) using the information you give us and the documents you upload, and submit the application(s) to the Immigration department of countries for the programs you choose to apply to.</li>
          </Typography>
        </ContentCard>
        <ContentCard>
          <SectionTitle variant='h5'>
            Data Security
          </SectionTitle>
          <Typography component="ul">
            <li>We use certain encryption techniques to detect, prevent, and respond to fraud, security risks, and technical issues that could harm our users.</li>
            <li>We review our information collection and processing practices to ensure secure access to the servers.</li>
            <li>We limit access of employees and agents to your personal information through the use of strong passwords and access control mechanisms, ensuring that there is no misuse of your profile information.</li>
            <li>Our advanced security systems protect your profile information, ensuring that it is kept private, and is not utilized for any other applicant, limiting the access to you only.</li>
          </Typography>
        </ContentCard>
        <ContentCard>
          <SectionTitle variant='h5'>
            User Rights
          </SectionTitle>
          <Typography component="ul">
            <li>Once you have signed in, you can access, review, and update your information.</li>
            <li>You may also close your account if you want to withdraw your consent from our further use of your information.</li>
            <li>Users can grant and revoke the access of their profile whenever required and limit the use of their profile.</li>
          </Typography>
        </ContentCard>
        <ContentCard>
          <SectionTitle variant='h5'>
            Children Privacy Protection
          </SectionTitle>
          <Typography paragraph>
            The services on our Website are intended for those seeking immigration assistance, including individuals who may be younger than 18. If the individual is under 18, their legal guardian must give consent for the collection, use, and disclosure of their Personal Information.
          </Typography>
        </ContentCard>
        <ContentCard>
          <SectionTitle variant='h5'>
            Changes to This Privacy Policy
          </SectionTitle>
          <Typography paragraph>
            We change this Privacy Policy from time to time without reducing your rights. If changes are significant, we’ll provide a notice (email notification of Privacy Policy changes).
          </Typography>
        </ContentCard>
      </Container>
    </Box>
  )
}

export default PrivacyPolicyPage;
