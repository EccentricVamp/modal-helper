const ID_MODAL = "modal-helper";
const SELECTOR_DATA_TOGGLE_MODAL = "[data-toggle=\"modal-helper\"]";

function getModal(): HTMLDivElement {
    const modal = document.getElementById(ID_MODAL);
    if (modal instanceof HTMLDivElement) return modal;
    else throw new Error("Modal is missing");
}

export function initialize(): void {
    let modal = document.getElementById(ID_MODAL);

    if (!modal) {
        modal = document.createElement("div");
        modal.id = ID_MODAL;
        modal.className = "modal fade";
        modal.tabIndex = -1;
        document.body.appendChild(modal);
    }

    const buttons = document.querySelectorAll(SELECTOR_DATA_TOGGLE_MODAL);
    for (const button of buttons) {
        button.addEventListener("click", show);
    }
}

export async function loaded(): Promise<void> {
    const modal = getModal();
    const form = modal.getElementsByTagName("form")[0];
    form.addEventListener("submit", submit);

    const bootstrap = await import("bootstrap");
    const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
    bsModal.show();
}


export async function show(event: Event): Promise<void> {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) {
        throw new Error("Target is not element");
    }

    const source = target.dataset.source;
    if (!source) throw new Error("Missing source");

    const response = await fetch(source);
    const text = await response.text();

    const modal = getModal();
    modal.innerHTML = text;

    const scripts = modal.getElementsByTagName("script");
    for (const script of scripts) {
        eval(script.innerText);
    }

    loaded();
}

export async function submit(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const info = { method: form.method, body: new FormData(form) }
    const response = await fetch(form.action, info);
    if (response.ok) window.location.reload();
}

initialize();