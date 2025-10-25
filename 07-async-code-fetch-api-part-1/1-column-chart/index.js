import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {

  constructor(props = {}) {

    const {
      data = [],
      url,
      range = {},
      label = '',
      link = '',
      formatHeading = (value) => value,
      value = 0,
    } = props;

    super({data, label, value, link, formatHeading});

    const {from, to} = range;
    this.url = url;
    this.subElements = this.createSubElements();
    this.fetchData(from, to).then();
  }

  createSubElements() {
    const subElements = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const element of elements) {
      const name = element.dataset.element;
      subElements[name] = element;
    }

    return subElements;
  }
  getUrl (from, to) {
    const url = new URL(BACKEND_URL);
    url.pathname = this.url;
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);

    return url.toString();
  }

  async update (from, to) {
    let data = [];
    try {
      this.element.classList.add('column-chart_loading');
      data = this.fetchData(from, to).then();
      this.element.classList.remove('column-chart_loading');
    } catch (err) {
      console.log(err);
    }

    return data;
  }

  async fetchData(from, to) {
    try {
      const url = this.getUrl(from, to);
      const response = await fetch(url);
      const data = await response.json();

      this.data = Object.values(data);
      this.subElements.body.innerHTML = this.createChartTemplate();

      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
