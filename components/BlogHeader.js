class BlogHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="header-container">
            <h1 class="header">
                <a href="">φ</a>
            </h1>

            <div class="navigator-container">
                <p><a href="">Projects</a></p>
                <p>__φ__</p>
                <p><a href="">Writing</a></p>
                <p>__φ__</p>
                <p><a href="">Media</a></p>
                <p>__φ__</p>
                <p><a href="">Misc</a>⠀</p>
                <p>__φ__</p>
                <p><a href="">About</a>⠀⠀</p>
            </div>
        </div>
        `;
    }
}

customElements.define('blog-header', BlogHeader);