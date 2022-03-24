class SiteHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div class="header-container">
            <h1 class="header">
                <a href="/index.html">φ</a>
            </h1>

            <div class="navigator-container">
                <p><a href="/pages/projects/index.html">Projects</a></p>
                <p>__φ__</p>
                <p><a href="/pages/nothing.html">Writing</a></p>
                <p>__φ__</p>
                <p><a href="/pages/nothing.html">Media</a></p>
                <p>__φ__</p>
                <p><a href="/pages/nothing.html">Misc</a>⠀</p>
                <p>__φ__</p>
                <p><a href="/pages/about.html">About</a>⠀⠀</p>
            </div>
        </div>
        `;
    }
}

customElements.define('site-header', SiteHeader);