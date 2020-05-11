  // obsverer object
  const subNavList = {
    container: document.querySelector('#subnav'),
    anchors: null,
    headers: null,
    intersectionOptions: {
      root: this.headers,
      rootMargin: '-200px'
    },
    observer: null,

    // initialise method
    init () {
      this.handler = this.handler.bind(this)
      this.setUp()
      this.findElements()
      this.sections()
    },

    // handler for entries (e), (o) observer
    handler (e, o) {
      e.forEach(entry => {
        // get anchor href
        let href = '#' + entry.target.getAttribute('id'),

          // find the current anchor
          link = this.anchors.find(a => a.getAttribute('href') === href),

          // find element that has current active.
          cActive = document.querySelector('.subnav-link.is-active')

        // check if we have an intersection add class
        if (entry.isIntersecting) {
          link.classList.add('is-active')
          // if current active exists remove else leave null
          cActive ? cActive.classList.remove('is-active') : null
        } else {
          link.classList.remove('is-active')
        }
      })
    },

    setUp () {
      this.observer = new IntersectionObserver(
        this.handler,
        this.intersectionOptions
      )
    },

    // create array of anchors for active and elements that will be observed.
    findElements () {
      this.anchors = [...this.container.querySelectorAll('a')]
      this.headers = this.anchors.map(anchor => {
        let id = anchor.getAttribute('href')
        return document.querySelector(id)
      })
    },

    // tell the observer what elements to observe the headers (h)
    sections () {
      this.headers.forEach(h => {
        this.observer.observe(h)
      })
    }

  }

  function checkSubNav () {
    let subnav = $('.subnav'), // the themes navbar
      osH = $('nav.navbar').outerHeight(), // get the height of the main navbar
      child = subnav.children().hasClass('fixed-top') // to check child element has already got class fixed-top.

    // if themes navbar already has fixed-top no need to check
    if ($(window).scrollTop() > subnav.offset().top - osH && !child) {
      subnav.css('height', subnav.children().css('top', osH).outerHeight())
      subnav.children().addClass('fixed-top bg-dark')
    } else if ($(window).scrollTop() < subnav.offset().top - osH && child) {
      subnav.css('height', '').children().css('top', '')
      subnav.children().removeClass('fixed-top bg-dark sticky')
    }
  }

  subNavList.init()
  // checkSubNav();
  // $(window).on("scroll", checkSubNav); // might need to compare performance using a throttle/debounce
