import { HeaderComponent } from '../../components/header/index.js';
import { MainPage } from '../main/index.js';
import { ajax } from '../../modules/ajax.js';
import { stockUrls } from '../../modules/stockUrls.js';

export class EditPage {
    constructor(parent, id) {
        this.parent = parent;
        // id === null — режим создания новой карточки
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
        const title = data.title || '';
        const category = data.category || '';
        const year = data.year || '';
        const status = data.status || 'Success';
        const description = data.description || '';
        const fullDescription = data.fullDescription || '';
        const src = data.src || '';

        const statuses = ['Success', 'Failure', 'Partial'];
        const statusOptions = statuses
            .map(s => `<option value="${s}" ${status === s ? 'selected' : ''}>${s}</option>`)
            .join('');

        return `
        <div class="edit-form-wrapper">
            <div class="row g-4">
                <!-- Превью изображения -->
                <div class="col-12 col-md-5">
                    <div class="edit-img-preview-wrap">
                        <img
                            id="edit-img-preview"
                            src="${src || 'https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=800&q=85'}"
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
                            <label for="edit-title" class="edit-label">Mission Title</label>
                            <input
                                type="text"
                                id="edit-title"
                                class="form-control edit-input"
                                value="${title}"
                                placeholder="e.g. Falcon 9 — CRS-26"
                            />
                        </div>

                        <div class="row g-3">
                            <div class="col-6">
                                <label for="edit-category" class="edit-label">Category</label>
                                <input
                                    type="text"
                                    id="edit-category"
                                    class="form-control edit-input"
                                    value="${category}"
                                    placeholder="e.g. Cargo, Crew, Starlink"
                                />
                            </div>
                            <div class="col-3">
                                <label for="edit-year" class="edit-label">Year</label>
                                <input
                                    type="number"
                                    id="edit-year"
                                    class="form-control edit-input"
                                    value="${year}"
                                    placeholder="2024"
                                    min="2000"
                                    max="2100"
                                />
                            </div>
                            <div class="col-3">
                                <label for="edit-status" class="edit-label">Status</label>
                                <select id="edit-status" class="form-select edit-input">
                                    ${statusOptions}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label for="edit-src" class="edit-label">Image URL</label>
                            <input
                                type="url"
                                id="edit-src"
                                class="form-control edit-input"
                                value="${src}"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label for="edit-description" class="edit-label">Short Description</label>
                            <textarea
                                id="edit-description"
                                class="form-control edit-input"
                                rows="2"
                                placeholder="Brief summary shown on the card..."
                            >${description}</textarea>
                        </div>

                        <div>
                            <label for="edit-full-description" class="edit-label">Full Description</label>
                            <textarea
                                id="edit-full-description"
                                class="form-control edit-input"
                                rows="4"
                                placeholder="Detailed mission description..."
                            >${fullDescription}</textarea>
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
        ajax.get(stockUrls.getStockById(this.id), (data, status) => {
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
                <h1 class="page-title">${this.isNew ? 'Add Mission' : (data.title || 'Edit Mission')}</h1>
            </div>
        `);

        this.pageRoot.insertAdjacentHTML('beforeend', this.getFormHTML(data));

        // Живое обновление превью при изменении URL картинки
        document.getElementById('edit-src').addEventListener('input', (e) => {
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
            // Новая карточка — пустая форма сразу
            this.renderForm({});
        } else {
            // Редактирование — загружаем данные по API
            this.pageRoot.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-light" role="status"></div>
                    <p class="text-secondary mt-3">Loading mission data...</p>
                </div>`;
            this.getData();
        }
    }
}
