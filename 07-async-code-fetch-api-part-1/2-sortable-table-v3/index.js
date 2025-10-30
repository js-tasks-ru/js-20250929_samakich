import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  start = 0;
  end = 30;
  static size = 30;
  isLoadingData = false;
  constructor(headersConfig, params = {}) {
    const {
      data = [],
      sorted = {
        id: headersConfig.find((item) => item.sortable).id,
        order: 'asc'
      },
      url = '',
      isSortLocally = false
    } = params;


    super(headersConfig, {data, sorted, url, isSortLocally: true});
    this.url = url;
    this.isSortLocally = isSortLocally;

    this.render();
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

    this.data = [];
    this.start = 0;
    this.end = 30;

    await this.render();
  }

  async render() {
    if (this.isLoadingData || !this.url) {
      return;
    }

    this.subElements.loading.style.display = 'block';
    try {

      const url = this.getUrl();
      const data = await fetchJson(url);

      this.isLoadingData = true;

      /*if (!data.length) {
        this.isLoadingData = true;
        return;
      }*/
      for (let item of data) {
        this.data.push(item);
      }
      this.subElements.body.innerHTML = this.createBodyTemplate();

    } catch (err) {
      console.log(err);
    } finally {
      this.subElements.loading.style.display = 'none';
      this.isLoadingData = false;
    }
  }

  async handleScroll() {
    if (!this.isLoadingData) {
      const scrollPosition = window.scrollY + window.innerHeight; // Текущая позиция скролла + высота видимой области
      const documentHeight = document.body.clientHeight - 50; // Полная высота документа

      if (scrollPosition >= documentHeight) {
        this.start = this.end;
        this.end += SortableTable.size;

        await this.render();
      }
    }
  }

  createListeners() {
    super.createListeners();

    window.addEventListener('scroll', this.handleScroll.bind(this));


  }

  destroyListeners() {
    super.destroyListeners();

    window.removeEventListener('scroll', this.handleScroll.bind(this));


  }
}
