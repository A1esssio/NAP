import { HeaderComponent } from "../../components/header/index.js";
import { ItemDetailComponent } from "../../components/item-detail/index.js";
import { MainPage } from "../main/index.js";

export class DetailPage {
    constructor(parent, id, data) {
        this.parent = parent;
        this.id = Number(id);
        this.data = data;
    }

    getData() {
        return this.data.find(item => item.id === this.id);
    }

    get pageRoot() {
        return document.getElementById('detail-page');
    }

    getHTML() {
        return `<div class="container-fluid page-wrapper"><div id="detail-page"></div></div>`;
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

        const data = this.getData();

        if (!data) {
            this.pageRoot.innerHTML = `
                <div class="text-center py-5">
                    <p class="fs-5 fw-semibold text-white mb-2">Mission not found</p>
                    <p class="text-secondary">This mission may have been deleted.</p>
                </div>`;
            return;
        }

        this.pageRoot.insertAdjacentHTML('beforeend', `
            <div class="mb-4">
                <p class="page-subtitle">Mission Details</p>
                <h1 class="page-title">${data.title}</h1>
            </div>
        `);

        const detail = new ItemDetailComponent(this.pageRoot);
        detail.render(data);
    }
}
