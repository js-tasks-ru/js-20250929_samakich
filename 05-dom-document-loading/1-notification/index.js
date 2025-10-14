export default class NotificationMessage {
  static lastElement = null;

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
      NotificationMessage.lastElement.hide();
    }

    if (div) {
      div.append(this.element);
    } else {
      document.body.append(this.element);
    }

    this.timer = setTimeout(() => {
      this.hide();
    }, this.duration);
  }

  createElement() {
    const element = document.createElement('div');

    element.innerHTML = this.createTemplate();

    const firstElementChild = element.firstElementChild;

    NotificationMessage.lastElement = this;

    document.body.append(element);

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

  hide() {
    clearTimeout(this.timer);
    const divDelete = document.querySelector('.notification');
    divDelete.remove();
    //NotificationMessage.lastElement.hidden = true;
  }

  destroy() {
    this.element.remove();
  }
}
