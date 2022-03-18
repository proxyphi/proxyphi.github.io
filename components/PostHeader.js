class PostHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        const date = this.getAttribute('date');

        this.innerHTML = `
        <div id="post-header-container">
            <h1 class="post-title">
                ${title}
            </h1>

            <p class="post-time">${date}</p>
        </div>
        `;
    }
}

customElements.define('post-header', PostHeader);