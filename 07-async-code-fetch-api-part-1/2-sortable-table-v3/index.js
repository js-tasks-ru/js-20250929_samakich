import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  start;
  end;
  size;
  isLoadingData;
  constructor(headersConfig, params = {}) {
    const {
      data = [],
      sorted = {
        id: headersConfig.find((item) => item.sortable).id,
        order: 'asc'
      },
      url = '',
      isSortLocally = true
    } = params;


    super(headersConfig, {data, sorted, url, isSortLocally});

    this.url = url;
    this.isSortLocally = isSortLocally;

    this.start = 0;
    this.end = 30;
    this.size = 30;

    this.isLoadingData = false;

    this.render().then();
  }

  getUrl() {
    const url = new URL(BACKEND_URL);
    url.pathname = this.url;
    url.searchParams.set('_embed', 'subcategory.category');
    url.searchParams.set('_sort', this.sorted.id);
    url.searchParams.set('_order', this.sorted.order);
    url.searchParams.set('_start', this.start.toString());
    url.searchParams.set('_end', this.end.toString());

    return url.toString();
  }

  async sortOnServer (id, order) {
    super.sortOnServer(id, order);

    this.sorted.id = id;
    this.sorted.order = order;

    await this.render();
  }

  async render() {
    if (this.isLoadingData) {
      return;
    }

    this.subElements.loading.style.display = 'block';
    try {

      const url = this.getUrl();
      const response = await fetch(url);
      const data = await response.json();

      if (!data.length) {
        this.isLoadingData = true;
        return;
      }
      for (let item of data) {
        this.data.push(item);
      }
      this.subElements.body.innerHTML = this.createBodyTemplate();

    } catch (err) {
      console.error(err);
    } finally {
      this.subElements.loading.style.display = 'none';
      this.isLoadingData = false;
    }
  }

  handleScroll = (e) => {
    if (this.isLoadingData) {
      return;
    }

    const scrollPosition = window.scrollY + window.innerHeight; // Текущая позиция скролла + высота видимой области
    const documentHeight = document.body.clientHeight; // Полная высота документа

    if (scrollPosition >= documentHeight - 50) {
      this.start = this.end + 1;
      this.end += this.size;

      this.render().then();
    }
  }

  createListeners() {
    document.addEventListener('scroll', e => this.handleScroll(e));

    super.createListeners();
  }

  destroyListeners() {
    document.removeEventListener('scroll', e => this.handleScroll(e));

    super.destroyListeners();
  }
}
