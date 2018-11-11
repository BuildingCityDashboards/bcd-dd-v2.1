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

    handler(e, o) {
      e.forEach(entry => {
        let href = "#" + entry.target.getAttribute("id"),
            link = this.anchors.find(a => a.getAttribute("href") === href);
        
        if (entry.isIntersecting) {
          link.classList.add("is-active");
          this.prev = entry.target.getAttribute("id");
        } 
        else {
          link.classList.remove("is-active");
        }
      });
    },

    sections() {
      this.headers.forEach(heading => {
        this.observer.observe(heading);
      });
    },

    setUp() {
      this.observer = new IntersectionObserver(
        this.handler,
        this.intersectionOptions
      );
    },

    findElements() {
      this.anchors = [...this.container.querySelectorAll("a")];
      this.headers = this.anchors.map(link => {
        let id = link.getAttribute("href");
        return document.querySelector(id);
      });
    }
  };


  subNavList.init();