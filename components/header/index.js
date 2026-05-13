export class HeaderComponent {
  constructor(parent) {
    this.parent = parent;
  }

  addListeners(onHomeClick) {}

  getHTML() {
    return `
        <nav class="navbar navbar-dark spacex-header sticky-top">
            <div class="container-fluid px-4">
                <div class="logo">
                    <a href="index.html">
                        <img src="image/SpaceX_Logo_Black.png" alt="SPACEX" />
                    </a>
                </div>
            </div>
        </nav>
        `;
  }

  render(onHomeClick) {
    this.parent.insertAdjacentHTML("beforeend", this.getHTML());
  }
}
