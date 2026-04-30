import { items } from "../../mock/items.js";
import { HeaderComponent } from "../../components/header/index.js";
import { FilterComponent } from "../../components/filter/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.masterData = [...items];
        this.data = [...items];
        this.filteredData = [...this.data];
        this.bsModal = null;
        this.currentIndex = 0;
    }

    getCategories() {
        return [...new Set(this.data.map(item => item.category))];
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
                <button
                    id="add-btn"
                    class="btn btn-light btn-add ms-auto"
                    data-bs-toggle="modal"
                    data-bs-target="#addMissionModal"
                >
                    + Add Mission
                </button>
            </div>

            <div class="mission-carousel-wrapper" id="carousel-wrapper">
                <button class="carousel-nav-btn carousel-nav-btn--prev" id="carousel-prev">&#8592;</button>
                <div class="mission-carousel-track" id="carousel-track"></div>
                <button class="carousel-nav-btn carousel-nav-btn--next" id="carousel-next">&#8594;</button>
                <div class="carousel-dots" id="carousel-dots"></div>
            </div>
        </div>

        <div
            class="modal fade"
            id="addMissionModal"
            tabindex="-1"
            aria-labelledby="addMissionModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div class="modal-content modal-custom">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title" id="addMissionModalLabel">Add Mission</h5>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="modal-body p-0">
                        <p class="px-3 pt-3 pb-2 text-secondary small">
                            Select a mission from the catalog to add to your list
                        </p>
                        <div id="modal-list" class="px-3 pb-3 d-flex flex-column gap-2"></div>
                    </div>
                </div>
            </div>
        </div>`;
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
                    <p class="text-secondary">Try changing the filter or add a new mission.</p>
                </div>`;
            return;
        }

        // Clamp index
        if (this.currentIndex >= this.filteredData.length) this.currentIndex = 0;

        // Build slides
        this.filteredData.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.dataset.index = index;
            slide.innerHTML = this.getCardHTML(item);
            track.appendChild(slide);

            // Listeners
            slide.querySelector(`#detail-btn-${item.id}`)
                .addEventListener('click', (e) => this.onDetailClick(e));
            slide.querySelector(`#delete-btn-${item.id}`)
                .addEventListener('click', (e) => this.onDeleteClick(e));

            // Dot
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
            if (offset === 0)       slide.classList.add('is-active');
            else if (offset === -1) slide.classList.add('is-prev');
            else if (offset === 1)  slide.classList.add('is-next');
            else                    slide.classList.add('is-far');
        });

        if (dotsContainer) {
            Array.from(dotsContainer.querySelectorAll('.carousel-dot')).forEach((dot, i) => {
                dot.classList.toggle('carousel-dot--active', i === this.currentIndex);
            });
        }
    }

    renderModalList() {
        const list = document.getElementById('modal-list');
        list.innerHTML = '';
        const existingIds = new Set(this.data.map(i => i.id));
        const available = this.masterData.filter(i => !existingIds.has(i.id));

        if (available.length === 0) {
            list.innerHTML = `<p class="text-secondary text-center py-4">All missions are already in your list.</p>`;
            return;
        }

        available.forEach(item => {
            const el = document.createElement('div');
            el.className = 'modal-mission-item d-flex align-items-center gap-3 p-2 rounded';
            el.innerHTML = `
                <img src="${item.src}" alt="${item.title}" class="modal-mission-img rounded" />
                <div class="flex-grow-1 min-w-0">
                    <div class="text-secondary small text-uppercase fw-bold" style="letter-spacing:.1em;font-size:10px;">${item.category}</div>
                    <div class="fw-semibold text-truncate">${item.title}</div>
                    <div class="text-secondary small">${item.year}</div>
                </div>
                <button class="btn btn-outline-light btn-sm modal-add-btn" data-id="${item.id}">+</button>
            `;
            el.querySelector('.modal-add-btn').addEventListener('click', () => this.onModalAdd(item.id));
            list.appendChild(el);
        });
    }

    onModalAdd(id) {
        const mission = this.masterData.find(i => i.id === id);
        if (!mission || this.data.find(i => i.id === id)) return;

        const masterIndex = this.masterData.findIndex(i => i.id === id);
        let insertIndex = this.data.length;
        for (let i = 0; i < this.data.length; i++) {
            const di = this.masterData.findIndex(m => m.id === this.data[i].id);
            if (di > masterIndex) { insertIndex = i; break; }
        }
        this.data.splice(insertIndex, 0, mission);

        const select = document.getElementById('filter-select');
        const value = select ? select.value : 'all';
        this.filteredData = value === 'all'
            ? [...this.data]
            : this.data.filter(item => item.category === value);

        this.renderCards();
        this.renderModalList();

        const existingIds = new Set(this.data.map(i => i.id));
        const remaining = this.masterData.filter(i => !existingIds.has(i.id));
        if (remaining.length === 0 && this.bsModal) this.bsModal.hide();
    }

    onFilterChange(e) {
        const value = e.target.value;
        this.currentIndex = 0;
        this.filteredData = value === 'all'
            ? [...this.data]
            : this.data.filter(item => item.category === value);
        this.renderCards();
    }

    onDetailClick(e) {
        const id = Number(e.target.dataset.id);
        import("../detail/index.js").then(({ DetailPage }) => {
            const page = new DetailPage(this.parent, id, this.data);
            page.render();
        });
    }

    onDeleteClick(e) {
        const id = Number(e.target.dataset.id);
        this.data = this.data.filter(item => item.id !== id);
        this.filteredData = this.filteredData.filter(item => item.id !== id);
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

        const modalEl = document.getElementById('addMissionModal');
        this.bsModal = new bootstrap.Modal(modalEl);
        modalEl.addEventListener('show.bs.modal', () => this.renderModalList());

        const addBtn = document.getElementById('add-btn');
        const filter = new FilterComponent(null);
        addBtn.insertAdjacentHTML('beforebegin', filter.getHTML(this.getCategories()));
        document
            .getElementById('filter-select')
            .addEventListener('change', this.onFilterChange.bind(this));

        this.renderCards();

        document.getElementById('carousel-prev')
            .addEventListener('click', () => { this.currentIndex--; this.updateCarousel(); });
        document.getElementById('carousel-next')
            .addEventListener('click', () => { this.currentIndex++; this.updateCarousel(); });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft')  { this.currentIndex--; this.updateCarousel(); }
            if (e.key === 'ArrowRight') { this.currentIndex++; this.updateCarousel(); }
        });
    }
}
