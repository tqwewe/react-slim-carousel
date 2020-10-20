import React from 'react'

import Carousel, { useCarousel, withCarousel } from 'react-carousel'
import 'react-carousel/dist/index.css'

const images = [
  'https://www.humanesociety.org/sites/default/files/styles/2000x850/public/2018/08/kitten-440379.jpg?h=c8d00152&itok=dz_bhvnR',
  'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*',
  'https://www.nationalparks.nsw.gov.au/-/media/npws/images/native-animal-profiles/platypus-ornithorhynchus-anatinus/platypus-02.jpg',
  'https://hips.hearstapps.com/countryliving.cdnds.net/17/47/1511194376-cavachon-puppy-christmas.jpg'
]

const App = () => {
  const carousel = useCarousel()

  // useEffect(() => {
  //   console.log(carousel.options.infinite)
  // }, [carousel])

  return (
    <>
      <Carousel
        visibeSlides={2}
        slidesToScroll={1}
        orientation='vertical'
        style={{ width: 300, height: 100, display: 'inline-block' }}
      >
        {images.map((image) => (
          <div key={image}>
            <img
              style={{ width: '100%', height: '100%' }}
              draggable={false}
              src={image}
              alt='slide'
            />
          </div>
        ))}
      </Carousel>
      <button disabled={carousel.previousDisabled} onClick={carousel.previous}>
        Previous
      </button>
      <button disabled={carousel.nextDisabled} onClick={carousel.next}>
        Next
      </button>
    </>
  )
}

export default withCarousel()(App)
