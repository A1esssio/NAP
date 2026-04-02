export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(onHomeClick) {
        document
            .getElementById('home-button')
            .addEventListener('click', onHomeClick);
    }

    getHTML() {
        return `
        <nav class="navbar navbar-dark spacex-header sticky-top">
            <div class="container-fluid px-4">
                <span class="navbar-brand header-logo mb-0">SPACE<span class="text-secondary">X</span> ARCHIVE</span>
                <button id="home-button" class="btn btn-outline-secondary btn-sm btn-home">
                    &#8592; HOME
                </button>
            </div>
        </nav>
        `;
    }

    render(onHomeClick) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.addListeners(onHomeClick);
    }
}
