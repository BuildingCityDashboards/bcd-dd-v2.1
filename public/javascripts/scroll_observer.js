  //obsverer object
  const subNavList = {
    container: document.querySelector("#subnav"),
    anchors: null,
    headers: null,
    intersectionOptions: {
      root: this.headers,
      rootMargin: "-300px -300px -300px -300px",
      threshold: [0,0.1,0.25,0.75,1],
    },
    prev: null,
    observer: null,

    init() {
      this.handler = this.handler.bind(this);
      this.setUp();
      this.findElements();
      this.sections();
    },

    // handler for entries (e), (o) observer
    handler(e, o) {
      e.forEach(entry => {
        //get anchor href
        let href = "#" + entry.target.getAttribute("id"),
            //find the anchor
            link = this.anchors.find(a => a.getAttribute("href") === href);
        
        // check if we have an intersection add class
        if (entry.isIntersecting) {
          link.classList.add("is-active");
          this.prev = entry.target.getAttribute("id");
        } 
        else {
          link.classList.remove("is-active");
        }
      });
    },

    setUp() {
      this.observer = new IntersectionObserver(
        this.handler,
        this.intersectionOptions
      );
    },

    // create array of anchors for active and elements that will be observed.
    findElements() {
      this.anchors = [...this.container.querySelectorAll("a")];
      this.headers = this.anchors.map(anchor => {
        let id = anchor.getAttribute("href");
        return document.querySelector(id);
      });
    },

    // tell the observer what to elements to observe the headers (h)
    sections() {
      this.headers.forEach(h => {
        this.observer.observe(h);
      });
    }

  };

  subNavList.init();

  function checkSubNav(){
    
    let subnav = $(".subnav"),
        osH = $("nav.navbar").outerHeight();

    if ($(window).scrollTop() > subnav.offset().top - osH) {
      subnav.css("height", subnav.children().css("top", osH).outerHeight());
      subnav.children().addClass("fixed-top bg-dark");

    } 
    else {
      subnav.css("height", "").children().css("top", "");
      subnav.children().removeClass("fixed-top bg-dark");
    }

  }

  checkSubNav();
  $(window).on("scroll", checkSubNav);