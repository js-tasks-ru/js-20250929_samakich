export default class NotificationMessage {
  static lastElement;

  element;
  text;
  timer;
  constructor(text = '', param = {}) {
    const {
      duration = 0,
      type = 'success',
    } = param;

    this.duration = duration;
    this.type = type;
    this.text = text;
    this.timer = 0;
    this.element = this.createElement();
  }

  show(div) {
    if (NotificationMessage.lastElement) {
      NotificationMessage.lastElement.remove();
      clearTimeout(NotificationMessage.lastElement.timer);
    }

    if (div) {
      div.append(this.element);
    } else {
      document.body.append(this.element);
    }

    this.timer = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  createElement() {
    const element = document.createElement('div');

    element.innerHTML = this.createTemplate();

    const firstElementChild = element.firstElementChild;

    NotificationMessage.lastElement = this;

    return firstElementChild;
  }

  createTemplate() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
                ${this.text}
            </div>
        </div>
    </div>
    `;
  }

  remove() {
    this.destroy();
  }

  destroy() {
    this.element.remove();
  }
}
