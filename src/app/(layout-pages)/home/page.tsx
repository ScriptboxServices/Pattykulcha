import ContentPage from '@/views/landingpage/contentsection'
import FooterSection from '@/views/landingpage/footersection'
import HeaderSection from '@/views/landingpage/header'
import MenuSection from '@/views/landingpage/menusection'

const LandingPage = () => {
  return (
    <>
        <HeaderSection/>
        <MenuSection/>
        <ContentPage/>
        <FooterSection/>
    </>
  )
}

export default LandingPage
