import { HeaderComponent } from '../../components/header/index.js';
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

    async getData() {
        const { data, status } = await ajax.get(stockUrls.getMissionById(this.id));
        if (status === 200 && data) {
            this.renderData(data);
        } else {
            this.pageRoot.innerHTML = `
                <div class="text-center py-5">
                    <p class="fs-5 fw-semibold text-white mb-2">Mission not found</p>
                    <p class="text-secondary">This mission may have been deleted or the server is unavailable.</p>
                </div>`;
        }
    }

    renderData(data) {
        this.pageRoot.innerHTML = '';

        this.pageRoot.insertAdjacentHTML('beforeend', `
            <div class="mb-4">
                <p class="page-subtitle">Mission Details</p>
                <h1 class="page-title">${data.mission_name}</h1>
            </div>

            <div class="card detail-card">
                <div class="row g-0">
                    <div class="col-md-6">
                        <img
                            src="${data.image}"
                            class="detail-card__img img-fluid"
                            alt="${data.mission_name}"
                            onerror="this.src='https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=800&q=85'"
                        />
                    </div>
                    <div class="col-md-6">
                        <div class="card-body detail-card__body d-flex flex-column gap-3 h-100 p-4">
                            <div class="detail-card__meta-item">
                                <span class="detail-card__meta-label">Mission ID</span>
                                <strong class="detail-card__meta-value">#${String(data.id).padStart(3, '0')}</strong>
                            </div>
                            <hr class="border-secondary" />
                            <p class="card-text detail-card__text">${data.description}</p>
                            <div class="mt-auto">
                                <button class="btn btn-outline-warning" id="btn-edit-detail">
                                    ✎ Edit Mission
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        document.getElementById('btn-edit-detail').addEventListener('click', () => {
            import('../edit/index.js').then(({ EditPage }) => {
                new EditPage(this.parent, this.id).render();
            });
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

        this.pageRoot.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-light" role="status"></div>
                <p class="text-secondary mt-3">Loading mission data...</p>
            </div>`;

        this.getData();
    }
}
