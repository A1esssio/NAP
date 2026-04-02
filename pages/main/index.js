import { items } from "../../mock/items.js";
import { HeaderComponent } from "../../components/header/index.js";
import { FilterComponent } from "../../components/filter/index.js";
import { ItemCardComponent } from "../../components/item-card/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.masterData = [...items];
        this.data = [...items];
        this.filteredData = [...this.data];
        this.bsModal = null;
    }

    get cardsContainer() {
        return document.getElementById('cards-container');
    }

    getCategories() {
        return [...new Set(this.data.map(item => item.category))];
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

            <!-- Toolbar -->
            <div class="d-flex align-items-center gap-3 flex-wrap mb-4" id="toolbar">
                <!-- FilterComponent renders here -->
                <button
                    id="add-btn"
                    class="btn btn-light btn-add ms-auto"
                    data-bs-toggle="modal"
                    data-bs-target="#addMissionModal"
                >
                    + Add Mission
                </button>
            </div>

            <!-- Cards grid using Bootstrap row-cols -->
            <div
                id="cards-container"
                class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4"
            ></div>
        </div>

        <!-- Bootstrap Modal -->
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
        </div>
        `;
    }

    renderCards() {
        this.cardsContainer.innerHTML = '';

        if (this.filteredData.length === 0) {
            this.cardsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="fs-5 fw-semibold text-white mb-2">No missions found</p>
                    <p class="text-secondary">Try changing the filter or add a new mission.</p>
                </div>`;
            return;
        }

        this.filteredData.forEach(item => {
            const card = new ItemCardComponent(this.cardsContainer);
            card.render(item, this.onDetailClick.bind(this), this.onDeleteClick.bind(this));
        });
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
        const cardWrapper = document.getElementById(`card-${id}`)?.closest('.col');
        if (cardWrapper) {
            cardWrapper.style.transition = 'opacity 0.25s, transform 0.25s';
            cardWrapper.style.opacity = '0';
            cardWrapper.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.data = this.data.filter(item => item.id !== id);
                this.filteredData = this.filteredData.filter(item => item.id !== id);
                this.renderCards();
            }, 250);
        } else {
            this.data = this.data.filter(item => item.id !== id);
            this.filteredData = this.filteredData.filter(item => item.id !== id);
            this.renderCards();
        }
    }

    render() {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent);
        header.render(() => {
            const page = new MainPage(this.parent);
            page.render();
        });

        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        // Init Bootstrap modal instance
        const modalEl = document.getElementById('addMissionModal');
        this.bsModal = new bootstrap.Modal(modalEl);
        modalEl.addEventListener('show.bs.modal', () => this.renderModalList());

        // Render filter
        const addBtn = document.getElementById('add-btn');
        const filter = new FilterComponent(null);
        addBtn.insertAdjacentHTML('beforebegin', filter.getHTML(this.getCategories()));
        document
            .getElementById('filter-select')
            .addEventListener('change', this.onFilterChange.bind(this));

        this.renderCards();
    }
}
