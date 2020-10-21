# react-slim-carousel

> Minimal react carousel made using hooks.

[![NPM](https://img.shields.io/npm/v/react-slim-carousel.svg)](https://www.npmjs.com/package/react-slim-carousel) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-slim-carousel
```

## Usage

```tsx
import React from 'react'

import Carousel, { withCarousel } from 'react-slim-carousel'
import 'react-slim-carousel/dist/index.css'

function Example() {
  return (
    <Carousel style={{ height: 400 }}>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </Carousel>
  )
}

export default withCarousel()(Example)
```

Ensure you wrap your component with `tsxwithCarousel(opts)(Component)` to give the context to the Carousel.

## Options

| Setting        | Type                         | Description                                | Default         |
| -------------- | ---------------------------- | ------------------------------------------ | --------------- |
| autoPlay       | `boolean`                    | Autoplay through slides                    | `false`         |
| centerMode     | `boolean`                    | Show active slide in the center            | `false`         |
| draggable      | `boolean`                    | Enable/disable drag to slide               | `true`          |
| easing         | `string`                     | CSS easing                                 | `'ease-in-out'` |
| gap            | `number`                     | Gap in pixels between each slide           | `0`             |
| infinite       | `boolean`                    | Intinite loop sliding                      | `false`         |
| initialSlide   | `number`                     | Initial slide to display                   | `0`             |
| interval       | `number`                     | Time in ms between autoplay sliding        | `3000`          |
| orientation    | `'horizontal' \| 'vertical'` | Slider orientation                         | `'horizontal'`  |
| playDirection  | `'normal' \| 'reverse'`      | Autoplay direction                         | `'normal'`      |
| slidesToScroll | `number`                     | Number of slides to scroll                 | `1`             |
| slideSpeed     | `number`                     | Transition speed in ms                     | `400`           |
| threshold      | `number`                     | Drag threshold for scrolling to next slide | `0.2`           |
| visibeSlides   | `number`                     | Number of slides visible                   | `1`             |

## Responsive

The Carousel component accepts an additional prop `responsive` which is an object with the keys being the pixel min width, and the value being settings to override.

Example:

```tsx
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

## `useCarousel` hook

You can access the carousel by using the `useCarousel` hook which provides the carousel's state along with functions to update it.

```tsx
import React from 'react'

import Carousel, { useCarousel, withCarousel } from 'react-slim-carousel'
import 'react-slim-carousel/dist/index.css'

function Example() {
  const { currentSlide, next, previous } = useCarousel()

  useEffect(() => {
    // Current slide changed
    console.log('Current slide = ' + currentSlide)
  }, [currentSlide])

  return (
    <div>
      <Carousel style={{ height: 400 }}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>

      <button onClick={previous}>Previous</button>
      <button onClick={next}>Next</button>
    </div>
  )
}

export default withCarousel()(Example)
```

_Note: don't update the state with `currentSlide = 2`, instead use the set functions available: `goTo(2)`_

## License

MIT © [Acidic9](https://github.com/Acidic9)
