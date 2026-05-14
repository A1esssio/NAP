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
        const description  = data.description  || '';
        const image        = data.image        || '';

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

                        <!-- Кнопка сохранения появляется в ЛР6 -->
                        <div class="d-flex gap-2 mt-2">
                            <button id="btn-save" class="btn btn-light flex-grow-1">
                                ${this.isNew ? '+ Create Mission' : '✓ Save Changes'}
                            </button>
                            <button id="btn-cancel" class="btn btn-outline-secondary">
                                Cancel
                            </button>
                        </div>

                        <!-- Статусное сообщение -->
                        <div id="save-status" class="edit-status" style="display:none;"></div>

                    </div>
                </div>
            </div>
        </div>`;
    }

    async getData() {
        const { data, status } = await ajax.get(stockUrls.getMissionById(this.id));
        if (status === 200 && data) {
            this.renderForm(data);
        } else {
            this.pageRoot.innerHTML = `
                <div class="text-center py-5">
                    <p class="fs-5 fw-semibold text-white mb-2">Mission not found</p>
                    <p class="text-secondary">Could not load mission data.</p>
                </div>`;
        }
    }

    async onSave() {
        const mission_name = document.getElementById('edit-name').value.trim();
        const image        = document.getElementById('edit-image').value.trim();
        const description  = document.getElementById('edit-description').value.trim();

        if (!mission_name || !description) {
            this.showStatus('error', 'Mission Name and Description are required.');
            return;
        }

        const payload = { mission_name, image, description };
        const saveBtn = document.getElementById('btn-save');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        let result;
        if (this.isNew) {
            result = await ajax.post(stockUrls.createMission(), payload);
        } else {
            result = await ajax.patch(stockUrls.updateMissionById(this.id), payload);
        }

        if (result.status === 200 || result.status === 201) {
            this.showStatus('success', this.isNew ? 'Mission created!' : 'Changes saved!');
            // Через секунду возвращаемся на главную
            setTimeout(() => new MainPage(this.parent).render(), 1000);
        } else {
            saveBtn.disabled = false;
            saveBtn.textContent = this.isNew ? '+ Create Mission' : '✓ Save Changes';
            this.showStatus('error', `Error ${result.status}. Please try again.`);
        }
    }

    showStatus(type, message) {
        const el = document.getElementById('save-status');
        if (!el) return;
        el.style.display = 'block';
        el.className = `edit-status edit-status--${type}`;
        el.textContent = message;
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

        // Живое превью изображения
        document.getElementById('edit-image').addEventListener('input', (e) => {
            const preview = document.getElementById('edit-img-preview');
            if (preview && e.target.value) preview.src = e.target.value;
        });

        // Сохранение
        document.getElementById('btn-save').addEventListener('click', () => this.onSave());

        // Отмена — назад на главную
        document.getElementById('btn-cancel').addEventListener('click', () => {
            new MainPage(this.parent).render();
        });
    }

    onHomeClick() {
        new MainPage(this.parent).render();
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
