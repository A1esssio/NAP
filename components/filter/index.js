export class FilterComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(onChangeListener) {
        document
            .getElementById('filter-select')
            .addEventListener('change', onChangeListener);
    }

    getHTML(categories) {
        const options = categories
            .map(cat => `<option value="${cat}">${cat}</option>`)
            .join('');

        return `
        <div class="d-flex align-items-center gap-2">
            <label for="filter-select" class="filter-label col-form-label-sm">
                Mission type
            </label>
            <select id="filter-select" class="form-select form-select-sm filter-select">
                <option value="all">All missions</option>
                ${options}
            </select>
        </div>
        `;
    }

    render(categories, onChangeListener) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(categories));
        this.addListeners(onChangeListener);
    }
}
