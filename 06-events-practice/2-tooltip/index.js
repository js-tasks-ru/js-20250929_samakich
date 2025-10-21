class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize () {
    this.createListeners();
  }

  render(text) {
    this.element = this.createElement(text);

    document.body.append(this.element);
  }

  createElement(text) {
    const element = document.createElement('div');
    element.className = 'tooltip';
    element.textContent = text;

    return element;
  }

  onDocumentMouseOver = (e) => {
    const text = e.target.dataset.tooltip;

    if (text) {
      this.render(text);
    }
  }

  onDocumentMouseOut = (e) => {
    this.remove();
  }

  onDocumentMouseMove = (e) => {
    this.element.style.color = '#EE82EE';
    this.element.style.backgroundColor = '#B0E0E6';
    this.element.style.left = `${e.clientX + 25}px`;
    this.element.style.Right = `${e.clientY + 25}px`;
  }

  createListeners() {
    document.addEventListener('pointerover', this.onDocumentMouseOver);
    document.addEventListener('pointerout', this.onDocumentMouseOut);
    document.addEventListener('pointermove', this.onDocumentMouseMove);
  }

  destroyListeners() {
    document.removeEventListener('pointerover', this.onDocumentMouseOver);
    document.removeEventListener('pointerout', this.onDocumentMouseOut);
    document.removeEventListener('pointermove', this.onDocumentMouseMove);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}

export default Tooltip;
