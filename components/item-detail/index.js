export class ItemDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getStatusBadgeClass(status) {
        if (status === 'Success') return 'badge-success-custom';
        if (status === 'Failure') return 'badge-failure-custom';
        return 'badge-partial-custom';
    }

    getHTML(data) {
        const statusClass = this.getStatusBadgeClass(data.status);
        return `
        <div class="card detail-card">
            <div class="row g-0">
                <div class="col-md-6">
                    <img
                        src="${data.src}"
                        class="detail-card__img img-fluid"
                        alt="${data.title}"
                    />
                </div>
                <div class="col-md-6">
                    <div class="card-body detail-card__body d-flex flex-column gap-3 h-100 p-4">
                        <div>
                            <span class="badge badge-category">${data.category}</span>
                        </div>
                        <h2 class="card-title detail-card__title">${data.title}</h2>

                        <div class="d-flex gap-4 flex-wrap">
                            <div class="detail-card__meta-item">
                                <span class="detail-card__meta-label">Year</span>
                                <strong class="detail-card__meta-value">${data.year}</strong>
                            </div>
                            <div class="detail-card__meta-item">
                                <span class="detail-card__meta-label">Status</span>
                                <span class="badge ${statusClass} mt-1" style="font-size:13px;padding:5px 12px;">${data.status}</span>
                            </div>
                            <div class="detail-card__meta-item">
                                <span class="detail-card__meta-label">Mission ID</span>
                                <strong class="detail-card__meta-value">#${String(data.id).padStart(3, '0')}</strong>
                            </div>
                        </div>

                        <hr class="border-secondary" />
                        <p class="card-text detail-card__text">${data.fullDescription}</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    render(data) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
    }
}
