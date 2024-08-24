'use client'
import React from 'react';

// MUI Imports
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

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
          <Typography variant='h2' component='h1' sx={{color:'black', fontWeight:600}}>
            Privacy Policy
          </Typography>
        </CardContent>
      </HeaderCard>
      <Container maxWidth="md" sx={{paddingY:6}}>
        <ContentCard className=' mt-4'>
          <Typography variant='h5' component='h1'>
            <strong>PRIVACY NOTICE</strong>
          </Typography>
          <Typography paragraph>
            <strong>Last Updated on August 8, 2024</strong>
          </Typography>
          <Typography paragraph>
            At Patty Kuchla (&rdquo;Patty Kuchla&rdquo;, &rdquo;we&rdquo;, or &rdquo;us&rdquo;), we value your privacy and want to explain the types of information we may gather, why we gather your information, how we use your information, when we might disclose your information, and how you can manage your information. This privacy policy applies to our website located at www.pattykuchla.com, and our services. This Privacy Notice does not apply to third-party websites and applications linked to or from the Site. We are not responsible for the actions and privacy policies of these third-party websites and applications.
          </Typography>
          <Typography paragraph>
            By using our Services, you accept the practices described in this Privacy Notice. We may update this Privacy Notice from time to time. Your continued use of our Services following the posting of changes will mean you accept those changes.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            INFORMATION WE COLLECT
          </SectionTitle>
          <Typography paragraph>
            <strong>Information We Collect from You</strong>
          </Typography>
          <Typography paragraph>
            We may collect non-personal and personal information directly from you when you use the website, such as when you register for an account, place an order, or access certain features or content. The information we collect includes:
          </Typography>
          <Typography component="ul">
            <li>Contact information: such as your name, phone number.</li>
            <li>Ordering information: such as your favourite items and order history.</li>
            <li>Delivery information: such as your delivery address.</li>
            <li>Payment and financial details: such as payment card number, expiration date, authentication code, and billing address, processed by a third-party processor.</li>
            <li>Login information: such as your username and password.</li>
            <li>Demographic information: such as your state and county of residence.</li>
          </Typography>

          <Typography paragraph>
            <strong>Collection of Information from Social Media Websites and Other Sources</strong>
          </Typography>
          <Typography paragraph>
            When you interact with Patty Kuchla on a social media platform, we may collect information you make available on that page, including your account ID or username. If you log into your Patty Kuchla account through a social networking service, we may share certain information about you and your activities with that service.
          </Typography>
          <Typography paragraph>
            We may also collect information from other sources, including business partners, vendors, or public sources.
          </Typography>

          <Typography paragraph>
            <strong>Information We Collect from Website Visitors</strong>
          </Typography>
          <Typography paragraph>
            We collect information when users interact with the Services. This includes:
          </Typography>
          <Typography component="ul">
            <li>Demographic data: such as age, gender, and ZIP code.</li>
            <li>Device information: about devices used to access the website.</li>
            <li>Usage and traffic information: such as pages viewed, date and time of access, and referring website addresses.</li>
          </Typography>

          <Typography paragraph>
            <strong>Collection of Your Location Information</strong>
          </Typography>
          <Typography paragraph>
            You may send us information that discloses your general location. The Site can deliver content based on your specific location if you enable that feature.
          </Typography>

          <Typography paragraph>
            <strong>Use of Cookies, Web Beacons, and Other Technologies</strong>
          </Typography>
          <Typography paragraph>
            We use cookies, web beacons, and other technologies to track use of our Site, improve the Site, and provide a better user experience. Cookies are small text files stored on your device when you visit certain online pages. Most web browsers automatically accept cookies, but you can modify your browser settings to disable or reject cookies. Note that some features of the Site may not function properly if cookies are disabled.
          </Typography>
          <Typography paragraph>
            We use Google Analytics to help us analyse how users interact with the website. Google Analytics collects information such as your IP address, time of visit, and referring website. The information generated by Google Analytics will be transmitted to and stored by Google and will be subject to Google&rsquo;s privacy policies.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            HOW WE USE YOUR INFORMATION
          </SectionTitle>
          <Typography paragraph>
            We use your information to personalise and improve your experience with the Services. Uses include:
          </Typography>
          <Typography component="ul">
            <li>Providing you with content, products, and services you request.</li>
            <li>Communicating with you about your account or transactions.</li>
            <li>Sending you information about features and enhancements.</li>
            <li>Sending newsletters, offers, promotions, or other communications.</li>
            <li>Advertising our products and services.</li>
            <li>Administering contests, sweepstakes, promotions, and surveys.</li>
            <li>Detecting and preventing activities that may violate our policies or be illegal.</li>
            <li>Enforcing our agreements.</li>
            <li>Improving our menu offerings and operations.</li>
            <li>Protecting the rights, safety, health, and security of our customers, employees, and the general public.</li>
            <li>Performing statistical, demographic, and marketing analyses.</li>
          </Typography>
          <Typography paragraph>
            We may combine information collected on one portion of the Services with information collected on other portions of the Services, and we may combine that information with information collected offline or from third-party sources.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            HOW WE SHARE YOUR INFORMATION
          </SectionTitle>
          <Typography paragraph>
            <strong>Third-Party Service Providers</strong>
          </Typography>
          <Typography paragraph>
            We use third-party service providers, agents, and affiliates to perform functions on our behalf, including hosting, content management, marketing, analytics, customer service, and payment processing. These entities may have access to your information to perform their services and are restricted from using it for any other purpose.
          </Typography>

          <Typography paragraph>
            <strong>Assignment</strong>
          </Typography>
          <Typography paragraph>
            In the event of a change in ownership or corporate organisation, or a sale of assets associated with the Services, we may transfer your information to the acquiring entity. We will request that the acquiring entity follow the practices described in this Privacy Notice.
          </Typography>

          <Typography paragraph>
            <strong>Law Enforcement, Legal Process, and Emergency Situations</strong>
          </Typography>
          <Typography paragraph>
            We may use or disclose personal information if required by law or in good faith that such action is necessary to comply with legal requirements, protect our rights or property, or act to protect the personal safety of users or the public.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            PROTECTING YOUR INFORMATION
          </SectionTitle>
          <Typography paragraph>
            We use commercially reasonable efforts to protect your personal information. However, no data transmission over the Internet or any public network can be guaranteed to be 100% secure.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            STORING YOUR INFORMATION
          </SectionTitle>
          <Typography paragraph>
            The retention period for your information varies according to its intended use. Unless legally required to retain it, we will keep your information no longer than necessary for the purposes for which it was collected.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            CHILDREN’S INFORMATION
          </SectionTitle>
          <Typography paragraph>
            The Services are not directed at children under 13 years of age. We do not knowingly collect personal information from children under 18 years of age without parental consent. If we discover that a child under 13 has provided us with personal information without parental consent, we will delete that information. If you believe a child has provided us with personal information without parental consent, please notify us immediately.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            PUBLIC AREAS OF THE SITE
          </SectionTitle>
          <Typography paragraph>
            Any information you share in public areas of the Site becomes public. Please be careful about what you disclose in these areas.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            CONTESTS AND PROMOTIONS
          </SectionTitle>
          <Typography paragraph>
            Specific rules apply to promotions that explain how the information you provide will be used and disclosed.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            NOTICE TO USERS OUTSIDE THE CANADA
          </SectionTitle>
          <Typography paragraph>
            The Services are directed to individuals in the United States. If you access the Services from outside Canada, you do so at your own risk and are responsible for compliance with local laws. By using the Services, you consent to the transfer of your personal information to Canada.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            CHOICES ABOUT HOW WE USE AND DISCLOSE YOUR INFORMATION
          </SectionTitle>
          <Typography component="ul">
            <li>Tracking Technologies and Advertising: Set your browser to refuse cookies or alert you when cookies are being sent. Some parts of the Site may be inaccessible if cookies are disabled.</li>
            <li>Promotional Offers: Opt out of promotional emails by following the instructions on the promotion or by emailing email.</li>
            <li>Do Not Track Signals: The Services do not respond to Do Not Track signals. We may continue to collect information as described in this Privacy Notice.</li>
            <li>Account Information: Review and change your information by logging into your account or contacting us at email. We may not be able to delete your personal information without deleting your user account.</li>
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            CHANGES TO OUR PRIVACY NOTICE
          </SectionTitle>
          <Typography paragraph>
            We may update this Privacy Notice from time to time. Changes will be posted on the Site, and we will only use data collected from the time of the Privacy Notice change forward for new or different purposes. If we make a material change, we will provide an opportunity to opt out of such use. The date of the last revision is at the top of this page. You are responsible for reviewing this Privacy Notice periodically.
          </Typography>
        </ContentCard>

        <ContentCard>
          <SectionTitle variant='h5'>
            STATE-SPECIFIC RIGHTS
          </SectionTitle>
          <Typography paragraph>
            If you are a resident of certain states within Canada, you may have additional rights. Please refer to the relevant state-specific notices regarding these rights.
          </Typography>
        </ContentCard>

        <ContentCard>
          <Typography paragraph>
            <strong>Copyright © 2024 PattyKuchla. All rights reserved.</strong>
          </Typography>
        </ContentCard>
      </Container>
    </Box>
  )
}

export default PrivacyPolicyPage;