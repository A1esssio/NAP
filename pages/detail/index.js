import { HeaderComponent } from '../../components/header/index.js';
import { ItemDetailComponent } from '../../components/item-detail/index.js';
import { MainPage } from '../main/index.js';
import { ajax } from '../../modules/ajax.js';
import { stockUrls } from '../../modules/stockUrls.js';

export class DetailPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = Number(id);
    }

    get pageRoot() {
        return document.getElementById('detail-page');
    }

    getHTML() {
        return `<div class="container-fluid page-wrapper"><div id="detail-page"></div></div>`;
    }

    getData() {
        ajax.get(stockUrls.getStockById(this.id), (data, status) => {
            if (status === 200 && data) {
                this.renderData(data);
            } else {
                this.pageRoot.innerHTML = `
                    <div class="text-center py-5">
                        <p class="fs-5 fw-semibold text-white mb-2">Mission not found</p>
                        <p class="text-secondary">This mission may have been deleted or the server is unavailable.</p>
                    </div>`;
            }
        });
    }

    renderData(data) {
        this.pageRoot.insertAdjacentHTML('beforeend', `
            <div class="mb-4">
                <p class="page-subtitle">Mission Details</p>
                <h1 class="page-title">${data.title}</h1>
            </div>
        `);

        const detail = new ItemDetailComponent(this.pageRoot);
        detail.render(data);

        // Кнопка редактирования
        const editBtn = document.createElement('div');
        editBtn.className = 'mt-4';
        editBtn.innerHTML = `
            <button class="btn btn-outline-warning" id="btn-edit-detail">
                ✎ Edit Mission
            </button>`;
        this.pageRoot.appendChild(editBtn);

        document.getElementById('btn-edit-detail').addEventListener('click', () => {
            import('../edit/index.js').then(({ EditPage }) => {
                const page = new EditPage(this.parent, this.id);
                page.render();
            });
        });
    }

    onHomeClick() {
        const page = new MainPage(this.parent);
        page.render();
    }

    render() {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent);
        header.render(this.onHomeClick.bind(this));

        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        // Показываем спиннер пока грузится
        this.pageRoot.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-light" role="status"></div>
                <p class="text-secondary mt-3">Loading mission data...</p>
            </div>`;

        this.getData();
    }
}
