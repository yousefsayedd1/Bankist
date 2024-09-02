'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const featuresSection = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const headerSection = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const leazyImages = document.querySelectorAll('.features__img');
const slides = document.querySelectorAll('.slide');
const sliderLeftBtn = document.querySelector('.slider__btn--left');
const sliderRightBtn = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener('click', () => {
  featuresSection.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////
// Page Navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    const section = document.querySelector(id);
    section.scrollIntoView({ behavior: 'smooth' });
  }
});
/////////////////////////////////
// Tabbed component
tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('button');
  // Guard clause
  if (!clicked) return;
  // Remove active classes
  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });
  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Remove active classes
  tabsContent.forEach(tabContent => {
    tabContent.classList.remove('operations__content--active');
  });
  // Activate content area
  const contentNumber = clicked.dataset.tab;
  [...tabsContent]
    .filter(tabContent =>
      tabContent.classList.contains(`operations__content--${contentNumber}`)
    )[0]
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  const link = e.target;
  if (e.target.classList.contains('nav__link')) {
    const linksContainer = link.closest('.nav__links');
    const links = linksContainer.querySelectorAll('.nav__link');
    links.forEach(link => {
      if (link != e.target) {
        link = link.closest('.nav__item');
        link.style.opacity = this;
      }
    });
    nav.querySelector('img').style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
const navHeight = nav.getBoundingClientRect().height;
const obsCallback = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(headerSection);

// Sections Fade In
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};
const SectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
sections.forEach(section => {
  // section.classList.add('section--hidden');
  SectionObserver.observe(section);
});

// Lazy images Loading
const imagesObserverCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('lazy-img');
      entry.target.src = entry.target.dataset.src;
      observer.unobserve(entry.target);
    }
  });
};
const imagesObserver = new IntersectionObserver(imagesObserverCallback, {
  root: null,
  threshold: 1,
});
leazyImages.forEach(image => {
  imagesObserver.observe(image);
});

// Slider
let curslide = 0;
const setSlidesPostions = (slides, curslide = 0) => {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - curslide)}%)`;
  });
};
const nextSlide = () => {
  curslide++;
  curslide %= slides.length;
  setSlidesPostions(slides, curslide);
  activateDot(dotContainer, curslide);
};
const activateDot = (dotsContainer, curslide = 0) => {
  const dots = dotContainer.children;
  [...dots].forEach(dot => {
    dot.classList.remove('dots__dot--active');
    if (dot.classList.contains(`dot-${curslide}`))
      dot.classList.add('dots__dot--active');
  });
};
const createDots = () => {
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add(`dot-${i}`);
    dot.classList.add(`dots__dot`);
    dot.dataset.slide = i;
    dotContainer.append(dot);
  });
};

const init = () => {
  setSlidesPostions(slides);
  createDots();
  activateDot(dotContainer);
};
init();
// Event Handlers
sliderRightBtn.addEventListener('click', nextSlide);
const prevSlide = () => {
  curslide = curslide === 0 ? slides.length - 1 : --curslide;
  setSlidesPostions(slides, curslide);
  activateDot(dotContainer, curslide);
};
sliderLeftBtn.addEventListener('click', prevSlide);
document.addEventListener('keydown', e => {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});
// Silder Dots

dotContainer.addEventListener('click', e => {
  if (!e.target.classList.contains('dots__dot')) return;
  curslide = e.target.dataset.slide;
  setSlidesPostions(slides, curslide);
  activateDot(dotContainer, curslide);
});
