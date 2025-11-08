import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  productsForm;
  categories = [];
  subElements;
  defaultFormData = {
    description: '',
    discount: 0,
    images: [],
    price: 100,
    quantity: 1,
    status: 1,
    subcategory: '',
    title: '',
  };

  get apiUrl () {
    const url = new URL(BACKEND_URL);
    url.pathname = '/api/rest/products';

    return url;
  }
  constructor (productId) {
    this.productId = productId;
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createFormTemplate();

    this.element = element.firstElementChild;
  }

  createFormTemplate() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          ${this.createLabelTemplate()}
          ${this.createDescriptionTemplate()}
          ${this.createListContainerTemplate()}
          ${this.createCategoriesTemplate()}
          ${this.createProductTemplate()}
          ${this.createSaveButtonTemplate()}
        </form>
      </div>
    `;
  }

  createLabelTemplate() {
    return `
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара" value="${escapeHtml(this.productsForm.title)}">
        </fieldset>
      </div>
    `;
  }

  createDescriptionTemplate() {
    return `
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">
            ${escapeHtml(this.productsForm.description || '')}
        </textarea>
      </div>
    `;
  }

  createListContainerTemplate() {
    return `
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        ${this.createListContainerImageTemplate()}
        ${this.createLoadButtonTemplate()}
      </div>
    `;
  }

  createListContainerImageTemplate() {
    return `
      <div data-element="imageListContainer">
          <ul class="sortable-list">
            ${this.productsForm.images?.map((image) => `
              <li class="products-edit__imagelist-item sortable-list__item" style="">
                  <input type="hidden" name="url" value="${escapeHtml(image.url)}">
                  <input type="hidden" name="source" value="${escapeHtml(image.source)}">
                  <span>
                      <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                      <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(image.url)}">
                      <span>${escapeHtml(image.source)}</span>
                  </span>
                  <button type="button">
                  <img src="icon-trash.svg" data-delete-handle="" alt="delete">
                  </button>
              </li>
            `).join('')}
          </ul>
      </div>
    `;
  }

  createLoadButtonTemplate() {
    return `
      <button type="button" name="uploadImage" class="button-primary-outline">
          <span>Загрузить</span>
      </button>
    `;
  }

  createCategoriesTemplate() {
    return `
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select id="subcategory" class="form-control" name="subcategory">
            ${this.categories.map(category =>
              (category.subcategories || []).map(subcategory => `
                <option value="${escapeHtml(subcategory.id)}" ${this.productsForm.subcategory === escapeHtml(subcategory.id) ? 'selected' : ''}>
                    ${escapeHtml(category.title)} > ${escapeHtml(subcategory.title)}
                </option>
              `).join('')
            ).join('')}
        </select>
      </div>
    `;
  }

  createProductTemplate() {
    return `
      ${this.createProductPriceTemplate()}
      ${this.createProductCountTemplate()}
      ${this.createProductStatusTemplate()}
    `;
  }

  createProductPriceTemplate() {
    return `
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input id="price" required="" type="number" name="price" class="form-control" placeholder="100" value="${this.productsForm.price?.toString()}">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0" value="${this.productsForm.discount?.toString()}">
        </fieldset>
      </div>
    `;
  }

  createProductCountTemplate() {
    return `
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1" value="${this.productsForm.quantity?.toString()}">
      </div>
    `;
  }

  createProductStatusTemplate() {
    return `
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select id="status" class="form-control" name="status">
          <option value="1" ${this.productsForm.status === '1' ? 'selected' : ''}>Активен</option>
          <option value="0" ${this.productsForm.status === '0' ? 'selected' : ''}>Неактивен</option>
        </select>
      </div>
    `;
  }

  createSaveButtonTemplate() {
    return `
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    `;
  }

  getSubElements() {
    const subElements = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const element of elements) {
      const name = element.dataset.element;
      subElements[name] = element;
    }

    this.subElements = subElements;
  }

  getProductUrl() {
    const url = this.apiUrl;
    url.searchParams.set('id', this.productId);

    return url.toString();
  }

  async fetchProducts() {
    try {
      const url = this.getProductUrl();
      const [data] = await fetchJson(url);

      return data;
    } catch (e) {
      console.log(e);
    }
  }

  getCategoryUrl() {
    const url = new URL(BACKEND_URL);
    url.pathname = '/api/rest/categories';
    url.searchParams.set('_sort', 'weigh');
    url.searchParams.set('_refs', 'subcategory');

    return url.toString();
  }

  async fetchCategories() {
    try {
      const url = this.getCategoryUrl();
      const data = await fetchJson(url);

      return data;
    } catch (e) {
      console.log(e);
    }
  }

  async render () {
    this.categories = await this.fetchCategories();

    if (this.productId) {
      this.productsForm = await this.fetchProducts();
    } else {
      this.productsForm = [this.defaultFormData];
    }

    this.createElement();
    this.getSubElements();
    this.createEventListeners();

    return this.element;
  }

  async saveProduct() {
    await fetchJson(this.apiUrl.toString(), {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...this.prepareFormData(),
        images: this.getImages()
      })
    });
  }

  async update() {
    await fetchJson(this.apiUrl.toString(), {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...this.prepareFormData(),
        images: this.getImages()
      })
    });
  }

  prepareFormData () {
    const productForm = this.subElements.productForm;
    const formData = new FormData(productForm);
    const product = Object.fromEntries(formData.entries());

    delete product.source;
    delete product.url;

    return product;
  }
  getImages () {
    const imagesArr = this.subElements.imageListContainer.querySelectorAll('li');
    const images = [];

    if (imagesArr.length > 0) {
      imagesArr.forEach(image => {
        images.push({
          url: image.querySelector('input[name="url"]').value,
          source: image.querySelector('input[name="source"]').value
        });
      });
    }

    return images;
  }

  async save () {
    if (this.productId) {
      await this.update();
      this.element.dispatchEvent(new CustomEvent('product-updated', {
        bubbles: true
      }));
    } else {
      await this.saveProduct();
      this.element.dispatchEvent(new CustomEvent('product-saved', {
        bubbles: true
      }));
    }
  }
  async handleSubmit(e) {
    e.preventDefault();
    await this.save();
  }

  createEventListeners() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.subElements.productForm.addEventListener('submit', this.handleSubmit);
  }

  removeEventListeners() {
    this.subElements.productForm.removeEventListener('submit', this.handleSubmit);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}
