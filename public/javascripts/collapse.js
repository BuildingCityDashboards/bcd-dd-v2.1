const triggerNodes = Array.from(document.querySelectorAll('[data-toggle="collapse"]'));

window.addEventListener('click', (ev) => {
  const elm = ev.target;
  if (triggerNodes.includes(elm)) {
    const selector = elm.getAttribute('data-target');
    collapse(selector, 'toggle');
  }
}, false);

const smap = {
  'toggle': 'toggle',
  'show': 'add',
  'hide': 'remove'
};

const collapse = (selector, cmd) => {
  const targetNodes = Array.from(document.querySelectorAll(selector));
  targetNodes.forEach(target => {
    target.classList[smap[cmd]]('show');
  });
}
