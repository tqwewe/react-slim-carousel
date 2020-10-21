import React, { useState } from 'react'

import Carousel, { useCarousel, withCarousel } from 'react-carousel'
import 'react-carousel/dist/index.css'

const images = [
  'https://www.humanesociety.org/sites/default/files/styles/2000x850/public/2018/08/kitten-440379.jpg?h=c8d00152&itok=dz_bhvnR',
  'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*'
  //   'https://www.nationalparks.nsw.gov.au/-/media/npws/images/native-animal-profiles/platypus-ornithorhynchus-anatinus/platypus-02.jpg',
  //   'https://hips.hearstapps.com/countryliving.cdnds.net/17/47/1511194376-cavachon-puppy-christmas.jpg'
]

const App = () => {
  const carousel = useCarousel()
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal'
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 1200,
        margin: '32px auto',
        backgroundColor: 'lightcoral'
      }}
    >
      <Carousel
        centerMode
        gap={10}
        infinite
        // orientation='vertical'
        playDirection='reverse'
        slidesToScroll={1}
        visibeSlides={2}
        responsive={{
          800: {
            orientation
          }
        }}
        style={{ width: '100%', height: 550, display: 'inline-block' }}
      >
        {images.map((image) => (
          <div key={image} style={{ height: '100%' }}>
            <img
              style={{ width: '100%', height: '100%' }}
              draggable={false}
              src={image}
              alt='slide'
            />
          </div>
        ))}
      </Carousel>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <button
          disabled={carousel.previousDisabled}
          onClick={carousel.previous}
        >
          Previous
        </button>
        <button disabled={carousel.nextDisabled} onClick={carousel.next}>
          Next
        </button>
      </div>
      <div>
        <h4>
          {carousel.currentSlide} {orientation}
        </h4>
      </div>
      <button
        onClick={() =>
          setOrientation((lastOrientation) =>
            lastOrientation === 'vertical' ? 'horizontal' : 'vertical'
          )
        }
      >
        Toggle orientation
      </button>
    </div>
  )
}

export default withCarousel()(App)
