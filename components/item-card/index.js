export class ItemCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(data, onDetailClick, onDeleteClick) {
        document
            .getElementById(`detail-btn-${data.id}`)
            .addEventListener('click', onDetailClick);
        document
            .getElementById(`delete-btn-${data.id}`)
            .addEventListener('click', onDeleteClick);
    }

    getStatusBadgeClass(status) {
        if (status === 'Success') return 'badge-success-custom';
        if (status === 'Failure') return 'badge-failure-custom';
        return 'badge-partial-custom';
    }

    getHTML(data) {
        const statusClass = this.getStatusBadgeClass(data.status);
        return `
        <div class="col">
            <div class="card mission-card h-100" id="card-${data.id}">
                <div class="mission-card__img-wrap">
                    <img
                        src="${data.src}"
                        class="card-img-top mission-card__img"
                        alt="${data.title}"
                        loading="lazy"
                    />
                    <span class="mission-card__year">${data.year}</span>
                </div>
                <div class="card-body d-flex flex-column gap-2">
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <span class="badge badge-category">${data.category}</span>
                        <span class="badge ${statusClass}">${data.status}</span>
                    </div>
                    <h5 class="card-title mission-card__title mb-0">${data.title}</h5>
                    <p class="card-text mission-card__text flex-grow-1">${data.description}</p>
                    <div class="d-flex gap-2 align-items-center mt-2">
                        <button
                            class="btn btn-outline-light btn-sm flex-grow-1 btn-detail"
                            id="detail-btn-${data.id}"
                            data-id="${data.id}"
                        >Details →</button>
                        <button
                            class="btn btn-outline-danger btn-sm btn-delete"
                            id="delete-btn-${data.id}"
                            data-id="${data.id}"
                            title="Remove mission"
                        >✕</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    render(data, onDetailClick, onDeleteClick) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        this.addListeners(data, onDetailClick, onDeleteClick);
    }
}
