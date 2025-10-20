export default class SortableTable {

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement();
    this.subElements = this.createSubElements();
  }

  createElement() {
    const element = document.createElement('div');

    element.innerHTML = this.createTemplate();

    return element;
  }

  createTemplate() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.createHeaderTemplate()}
      </div>

      <div data-element="body" class="sortable-table__body">
        ${this.createBodyTemplate()}
      </div>

      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
    `;
  }

  createHeaderTemplate() {
    return this.headerConfig.map((headerConfig) => {
      return `
        <div class="sortable-table__cell" data-id="${headerConfig.id}" data-sortable="${headerConfig.sortable}" ${this.orderValue === headerConfig.id ? 'data-order="' + this.orderType + '"' : ''}">
          <span>${headerConfig.title}</span>
        </div>
      `;
    }).join('');
  }

  createTableBodyCellTemplate(product, columnConfig) {
    if (columnConfig['template']) {
      return columnConfig['template'](product.images);
    }

    return `<div class="sortable-table__cell">${product[columnConfig.id]}</div>`;
  }

  createTableBodyRowTemplate(product) {
    return `
            <a href="/products/${product.id}" class="sortable-table__row">
                ${this.headerConfig.map(columnConfig =>
    this.createTableBodyCellTemplate(product, columnConfig)
  ).join('')}
            </a>
        `;
  }

  createBodyTemplate() {
    return this.data.map((row) => {
      return this.createTableBodyRowTemplate(row);
    }).join('');
  }

  sort(field, orderType) {
    this.orderValue = field;
    this.orderType = orderType;

    const direction = orderType === "desc" ? -1 : 1;
    const newArr = this.data.slice();

    this.data = newArr.sort((a, b) => {
      return typeof a[field] === 'string'
        ? direction * a[field].localeCompare(b[field], ["ru", "en"], {caseFirst: "upper"})
        : direction * (a[field] - b[field]);
    });

    this.subElements.body.innerHTML = this.createBodyTemplate();
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

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

