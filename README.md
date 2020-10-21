# react-slim-carousel

Minimal but feature-full react carousel made using hooks.

[![NPM](https://img.shields.io/npm/v/react-slim-carousel.svg)](https://www.npmjs.com/package/react-slim-carousel) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<a href="https://www.buymeacoffee.com/ariseyhun" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## Install

```bash
npm install --save react-slim-carousel
```

## Usage

```tsx
import React from 'react'

import {
  Carousel,
  CarouselProvider,
  PreviousButton,
  NextButton
} from 'react-slim-carousel'
import 'react-slim-carousel/dist/index.css'

export default function Example() {
  return (
    <CarouselProvider>
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
      <Dots />
      <PreviousButton>Previous</PreviousButton>
      <NextButton>Next</NextButton>
    </CarouselProvider>
  )
}
```

Alternatively, you can use the [HOC](https://reactjs.org/docs/higher-order-components.html) approach by wrapping your component in `withCarousel()(Component)`. You should not use the `<CarouselProvider>` when using the HOC approach.

```tsx
import React from 'react'

import { Carousel, withCarousel, useCarousel } from 'react-slim-carousel'
import 'react-slim-carousel/dist/index.css'

function Example() {
  const { currentSlide } = useCarousel()

  return (
    <>
      <Carousel>{/* Slides here */}</Carousel>
      <span>Current slide: {currentSlide}</span>
    </>
  )
}

export default withCarousel()(Example)
```

## Options

| Setting        | Type                        | Description                                                                 | Default         |
| -------------- | --------------------------- | --------------------------------------------------------------------------- | --------------- |
| autoPlay       | `boolean`                   | Autoplay through slides                                                     | `false`         |
| autoSize       | `boolean`                   | Set the height (or width) to the largest slide depending on the orientation | `true`          |
| centerMode     | `boolean`                   | Show active slide in the center                                             | `false`         |
| draggable      | `boolean`                   | Enable/disable drag to slide                                                | `true`          |
| easing         | `string`                    | CSS easing                                                                  | `'ease-in-out'` |
| edgeFriction   | `number`                    | Resistance when swiping edges of non-infinite carousels                     | `0.3`           |
| gap            | `number`                    | Gap in pixels between each slide                                            | `0`             |
| infinite       | `boolean`                   | Intinite loop sliding                                                       | `false`         |
| initialSlide   | `number`                    | Initial slide to display                                                    | `0`             |
| interval       | `number`                    | Time in ms between autoplay sliding                                         | `3000`          |
| orientation    | `'horizontal' | 'vertical'` | Slider orientation                                                          | `'horizontal'`  |
| playDirection  | `'normal' | 'reverse'`      | Autoplay direction                                                          | `'normal'`      |
| slidesToScroll | `number`                    | Number of slides to scroll                                                  | `1`             |
| slideSpeed     | `number`                    | Transition speed in ms                                                      | `400`           |
| threshold      | `number`                    | Drag threshold for scrolling to next slide                                  | `0.2`           |
| visibleSlides  | `number`                    | Number of slides visible                                                    | `1`             |

## Responsive

The Carousel component accepts an additional prop `responsive` which is an object with the keys being the pixel min width, and the value being settings to override.

Example:

```jsx
<Carousel
  visibleSlides={2}
  responsive={{
    768: {
      visibleSlides: 4
    }
  }}
>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>
```

## Styling

The bare minimum stylesheet should be imported from `'react-slim-carousel/dist/index.css'`. Styles for the previous/next buttons and dots are not included and should be done by your app.

Available classes:

**Carousel**

| Class                   | Description                             |
| ----------------------- | --------------------------------------- |
| `carousel`              | Base class                              |
| `carousel--horizontal`  | When orientation is set to 'horizontal' |
| `carousel--vertical`    | When orientation is set to 'vertical'   |
| `carousel--center-mode` | When centerMode is enabled              |

**Tray**

The tray is the direct child of the carousel and contains the slides.

| Class            | Description |
| ---------------- | ----------- |
| `carousel__tray` | Base class  |

**Slide**

| Class                     | Description                        |
| ------------------------- | ---------------------------------- |
| `carousel__slide`         | Base class                         |
| `carousel__slide--active` | When the slide is currently active |

**Previous button**

| Class                   | Description |
| ----------------------- | ----------- |
| `carousel-previous-btn` | Base class  |

**Next button**

| Class               | Description |
| ------------------- | ----------- |
| `carousel-next-btn` | Base class  |

**Dots**

| Class           | Description |
| --------------- | ----------- |
| `carousel-dots` | Base class  |

**Dot**

| Class                  | Description                |
| ---------------------- | -------------------------- |
| `carousel-dot`         | Base class                 |
| `carousel-dot--active` | When current dot is active |

## License

MIT © [Acidic9](https://github.com/Acidic9)
