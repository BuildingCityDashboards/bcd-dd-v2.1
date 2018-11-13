  //obsverer object
  const subNavList = {
    container: document.querySelector("#subnav"),
    anchors: null,
    headers: null,
    intersectionOptions: {
      root: null,
      rootMargin: "10px",
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
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
  console.log("test", subNavList);