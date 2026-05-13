import { HeaderComponent } from '../../components/header/index.js';
import { FilterComponent } from '../../components/filter/index.js';
import { ajax } from '../../modules/ajax.js';
import { stockUrls } from '../../modules/stockUrls.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.data = [];
        this.filteredData = [];
        this.currentIndex = 0;
    }

    getCategories() {
        return [...new Set(this.data.map((item) => item.category))];
    }

    getStatusBadgeClass(status) {
        if (status === 'Success') return 'badge-success-custom';
        if (status === 'Failure') return 'badge-failure-custom';
        return 'badge-partial-custom';
    }

    getCardHTML(item) {
        const statusClass = this.getStatusBadgeClass(item.status);
        return `
        <div class="card mission-card" id="card-${item.id}" style="width:100%;">
            <div class="mission-card__img-wrap">
                <img
                    src="${item.src}"
                    class="card-img-top mission-card__img"
                    alt="${item.title}"
                    loading="lazy"
                />
                <span class="mission-card__year">${item.year}</span>
            </div>
            <div class="card-body d-flex flex-column gap-2">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <span class="badge badge-category">${item.category}</span>
                    <span class="badge ${statusClass}">${item.status}</span>
                </div>
                <h5 class="card-title mission-card__title mb-0">${item.title}</h5>
                <p class="card-text mission-card__text">${item.description}</p>
                <div class="d-flex gap-2 align-items-center mt-2">
                    <button
                        class="btn btn-outline-light btn-sm flex-grow-1 btn-detail"
                        id="detail-btn-${item.id}"
                        data-id="${item.id}"
                    >Details →</button>
                    <button
                        class="btn btn-outline-warning btn-sm btn-edit"
                        id="edit-btn-${item.id}"
                        data-id="${item.id}"
                        title="Edit mission"
                    >✎</button>
                    <button
                        class="btn btn-outline-danger btn-sm btn-delete"
                        id="delete-btn-${item.id}"
                        data-id="${item.id}"
                        title="Remove mission"
                    >✕</button>
                </div>
            </div>
        </div>`;
    }

    getHTML() {
        return `
        <div class="container-fluid page-wrapper">
            <div class="row mb-4">
                <div class="col">
                    <p class="page-subtitle">Mission Archive</p>
                    <h1 class="page-title">All Missions</h1>
                </div>
            </div>

            <div class="d-flex align-items-center gap-3 flex-wrap mb-4" id="toolbar">
                <button id="add-btn" class="btn btn-light btn-add ms-auto">
                    + Add Mission
                </button>
            </div>

            <div class="mission-carousel-wrapper" id="carousel-wrapper">
                <button class="carousel-nav-btn carousel-nav-btn--prev" id="carousel-prev">&#8592;</button>
                <div class="mission-carousel-track" id="carousel-track">
                    <div class="carousel-loading text-center" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);">
                        <div class="spinner-border text-light" role="status"></div>
                        <p class="text-secondary mt-3">Loading missions...</p>
                    </div>
                </div>
                <button class="carousel-nav-btn carousel-nav-btn--next" id="carousel-next">&#8594;</button>
                <div class="carousel-dots" id="carousel-dots"></div>
            </div>
        </div>`;
    }

    getData() {
        ajax.get(stockUrls.getStocks(), (data, status) => {
            if (status === 200 && data) {
                this.data = data;
                this.filteredData = [...this.data];
                this.rebuildFilter();
                this.renderCards();
            } else {
                console.error('Ошибка загрузки миссий:', status);
                this.renderError();
            }
        });
    }

    renderError() {
        const track = document.getElementById('carousel-track');
        if (!track) return;
        track.innerHTML = `
            <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;padding:2rem;">
                <p class="fs-5 fw-semibold text-white mb-2">Не удалось загрузить миссии</p>
                <p class="text-secondary">Убедитесь, что сервер запущен на <code>http://localhost:3000</code><br>и включено расширение CORS Unblock.</p>
            </div>`;
    }

    rebuildFilter() {
        const addBtn = document.getElementById('add-btn');
        if (!addBtn) return;
        const existing = document.getElementById('filter-select');
        if (existing) existing.closest('.d-flex.align-items-center').remove();

        const filter = new FilterComponent(null);
        addBtn.insertAdjacentHTML('beforebegin', filter.getHTML(this.getCategories()));
        document
            .getElementById('filter-select')
            .addEventListener('change', this.onFilterChange.bind(this));
    }

    renderCards() {
        const track = document.getElementById('carousel-track');
        const dotsContainer = document.getElementById('carousel-dots');
        if (!track) return;

        track.innerHTML = '';
        dotsContainer.innerHTML = '';

        if (this.filteredData.length === 0) {
            track.innerHTML = `
                <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;">
                    <p class="fs-5 fw-semibold text-white mb-2">No missions found</p>
                    <p class="text-secondary">Try changing the filter.</p>
                </div>`;
            return;
        }

        if (this.currentIndex >= this.filteredData.length) this.currentIndex = 0;

        this.filteredData.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.dataset.index = index;
            slide.innerHTML = this.getCardHTML(item);
            track.appendChild(slide);

            slide.querySelector(`#detail-btn-${item.id}`)
                .addEventListener('click', (e) => this.onDetailClick(e));
            slide.querySelector(`#edit-btn-${item.id}`)
                .addEventListener('click', (e) => this.onEditClick(e));
            slide.querySelector(`#delete-btn-${item.id}`)
                .addEventListener('click', (e) => this.onDeleteClick(e));

            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.dataset.index = index;
            dot.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        this.updateCarousel();
    }

    updateCarousel() {
        const track = document.getElementById('carousel-track');
        const dotsContainer = document.getElementById('carousel-dots');
        if (!track) return;

        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        const total = slides.length;
        if (total === 0) return;

        this.currentIndex = ((this.currentIndex % total) + total) % total;

        slides.forEach((slide, i) => {
            let offset = i - this.currentIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-far');
            if (offset === 0) slide.classList.add('is-active');
            else if (offset === -1) slide.classList.add('is-prev');
            else if (offset === 1) slide.classList.add('is-next');
            else slide.classList.add('is-far');
        });

        if (dotsContainer) {
            Array.from(dotsContainer.querySelectorAll('.carousel-dot')).forEach(
                (dot, i) => dot.classList.toggle('carousel-dot--active', i === this.currentIndex)
            );
        }
    }

    onFilterChange(e) {
        const value = e.target.value;
        this.currentIndex = 0;
        this.filteredData =
            value === 'all'
                ? [...this.data]
                : this.data.filter((item) => item.category === value);
        this.renderCards();
    }

    onDetailClick(e) {
        const id = Number(e.target.dataset.id);
        import('../detail/index.js').then(({ DetailPage }) => {
            const page = new DetailPage(this.parent, id);
            page.render();
        });
    }

    onEditClick(e) {
        const id = Number(e.target.dataset.id);
        import('../edit/index.js').then(({ EditPage }) => {
            const page = new EditPage(this.parent, id);
            page.render();
        });
    }

    onDeleteClick(e) {
        const id = Number(e.target.dataset.id);
        this.data = this.data.filter((item) => item.id !== id);
        this.filteredData = this.filteredData.filter((item) => item.id !== id);
        if (this.currentIndex >= this.filteredData.length && this.currentIndex > 0) {
            this.currentIndex--;
        }
        this.renderCards();
    }

    render() {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent);
        header.render(() => {
            const page = new MainPage(this.parent);
            page.render();
        });

        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        document.getElementById('add-btn').addEventListener('click', () => {
            import('../edit/index.js').then(({ EditPage }) => {
                const page = new EditPage(this.parent, null);
                page.render();
            });
        });

        document.getElementById('carousel-prev').addEventListener('click', () => {
            this.currentIndex--;
            this.updateCarousel();
        });
        document.getElementById('carousel-next').addEventListener('click', () => {
            this.currentIndex++;
            this.updateCarousel();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { this.currentIndex--; this.updateCarousel(); }
            if (e.key === 'ArrowRight') { this.currentIndex++; this.updateCarousel(); }
        });

        this.getData();
    }
}
