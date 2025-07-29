import '../Styles/HeroSection.css';
import Container from './Container';

const HeroSection = () => {
   return (
      <section id="home" className="hero">
         <div className="overlay">
            <div className="hero-content">
               <Container>
                  <h1 className="title">RESTAURANTE EL BUEN SABOR</h1>
                  <p style={{fontSize:'24px', marginTop:'1rem'}} className='title-2'>Sabores auténticos que despiertan tus sentidos</p>
               </Container>
            </div>
         </div>
      </section>
   );
};

export default HeroSection;