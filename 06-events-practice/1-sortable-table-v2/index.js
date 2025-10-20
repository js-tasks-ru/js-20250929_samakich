import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTableV1 {
  constructor(headerConfig, params) {

    const {
      data = [],
      sorted = {},
      isSortLocally = true
    } = params;

    super(headerConfig, data);
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.createListeners();
    this.arrowElement = this.createArrowElement();
    const defaultHeader = this.subElements.header.querySelector(`[data-id = "${this.sorted.id}"]`);
    if (defaultHeader) {
      this.setSort(defaultHeader, this.sorted.order);
    }
  }

  setSort(defaultHeader, order) {
    defaultHeader.dataset.order = order;
    defaultHeader.append(this.arrowElement);
  }

  sort(sortField, sortOrder) {
    if (this.isSortLocally) {
      super.sort(sortField, sortOrder);
    } else {
      this.sortOnServer();
    }
  }

  sortOnServer() {

  }

  createArrowElement() {
    const arrowElement = document.createElement('div');

    arrowElement.innerHTML = this.createArrowTemplate();

    return arrowElement.firstElementChild;
  }

  createArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`;
  }

  handleHeaderCellClick = (e) => {
    const cellElement = e.target.closest('.sortable-table__cell');

    if (!cellElement) {
      return;
    }

    if (cellElement.dataset.sortable !== "true") {
      return;
    }

    const sortField = cellElement.dataset.id;
    const sortOrder = cellElement.dataset.order === 'desc' ? 'asc' : 'desc';

    this.setSort(cellElement, sortOrder);
    this.sort(sortField, sortOrder);
  }

  createListeners() {
    this.subElements.header.addEventListener('click', this.handleHeaderCellClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('click', this.handleHeaderCellClick);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
