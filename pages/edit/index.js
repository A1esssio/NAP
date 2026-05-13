import { HeaderComponent } from '../../components/header/index.js';
import { MainPage } from '../main/index.js';
import { ajax } from '../../modules/ajax.js';
import { stockUrls } from '../../modules/stockUrls.js';

export class EditPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id !== null && id !== undefined ? Number(id) : null;
        this.isNew = this.id === null;
    }

    get pageRoot() {
        return document.getElementById('edit-page');
    }

    getHTML() {
        return `<div class="container-fluid page-wrapper"><div id="edit-page"></div></div>`;
    }

    getFormHTML(data = {}) {
        const mission_name = data.mission_name || '';
        const description = data.description || '';
        const image = data.image || '';

        return `
        <div class="edit-form-wrapper">
            <div class="row g-4">
                <!-- Превью изображения -->
                <div class="col-12 col-md-5">
                    <div class="edit-img-preview-wrap">
                        <img
                            id="edit-img-preview"
                            src="${image || 'https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=800&q=85'}"
                            alt="Mission preview"
                            class="edit-img-preview"
                            onerror="this.src='https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=800&q=85'"
                        />
                    </div>
                </div>

                <!-- Поля формы -->
                <div class="col-12 col-md-7">
                    <div class="d-flex flex-column gap-3">

                        <div>
                            <label for="edit-name" class="edit-label">Mission Name</label>
                            <input
                                type="text"
                                id="edit-name"
                                class="form-control edit-input"
                                value="${mission_name}"
                                placeholder="e.g. Starlink Group 6-14"
                            />
                        </div>

                        <div>
                            <label for="edit-image" class="edit-label">Image URL</label>
                            <input
                                type="url"
                                id="edit-image"
                                class="form-control edit-input"
                                value="${image}"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label for="edit-description" class="edit-label">Description</label>
                            <textarea
                                id="edit-description"
                                class="form-control edit-input"
                                rows="5"
                                placeholder="Mission description..."
                            >${description}</textarea>
                        </div>

                        <div class="edit-notice">
                            <span class="edit-notice__icon">ℹ</span>
                            Кнопка <strong>Сохранить</strong> появится в следующей лабораторной работе.
                        </div>

                    </div>
                </div>
            </div>
        </div>`;
    }

    getData() {
        ajax.get(stockUrls.getMissionById(this.id), (data, status) => {
            if (status === 200 && data) {
                this.renderForm(data);
            } else {
                this.pageRoot.innerHTML = `
                    <div class="text-center py-5">
                        <p class="fs-5 fw-semibold text-white mb-2">Mission not found</p>
                        <p class="text-secondary">Could not load mission data.</p>
                    </div>`;
            }
        });
    }

    renderForm(data = {}) {
        this.pageRoot.innerHTML = '';

        this.pageRoot.insertAdjacentHTML('beforeend', `
            <div class="mb-4">
                <p class="page-subtitle">${this.isNew ? 'New Mission' : 'Edit Mission'}</p>
                <h1 class="page-title">${this.isNew ? 'Add Mission' : (data.mission_name || 'Edit Mission')}</h1>
            </div>
        `);

        this.pageRoot.insertAdjacentHTML('beforeend', this.getFormHTML(data));

        // Живое обновление превью при изменении URL картинки
        document.getElementById('edit-image').addEventListener('input', (e) => {
            const preview = document.getElementById('edit-img-preview');
            if (preview && e.target.value) preview.src = e.target.value;
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

        if (this.isNew) {
            this.renderForm({});
        } else {
            this.pageRoot.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-light" role="status"></div>
                    <p class="text-secondary mt-3">Loading mission data...</p>
                </div>`;
            this.getData();
        }
    }
}
