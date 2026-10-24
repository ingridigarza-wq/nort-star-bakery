// Products available to save.
const products = [
    { id: "signature-loaf", name: "Signature Loaf" },
    { id: "chocolate-chip-cookie", name: "Chocolate Chip Cookie" },
    { id: "celebration-cake", name: "Celebration Cake" }
];

// IDs of the user's favorite products.
let favorites = [];

const storageKey = "northStarBakeryFavorites";

function loadFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));

        if (Array.isArray(saved)) {
            favorites = products
                .filter(product => saved.includes(product.id))
                .map(product => product.id);
        }
    } catch {
        document.getElementById("storage-status").textContent =
            "Saved favorites could not be loaded. You can still select items.";
    }
}

function saveFavorites() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(favorites));

        document.getElementById("storage-status").textContent =
            "Your favorites are saved in this browser.";
    } catch {
        document.getElementById("storage-status").textContent =
            "Your choices work on this page, but could not be saved.";
    }
}

function renderFavorites() {
    const list = document.getElementById("favorites-list");
    const status = document.getElementById("favorites-status");

    list.replaceChildren();

    products.forEach(product => {
        if (favorites.includes(product.id)) {
            const item = document.createElement("li");
            item.textContent = product.name;
            list.appendChild(item);
        }
    });

    status.textContent = favorites.length === 0
        ? "No favorites saved yet."
        : favorites.length + " favorite item(s) selected.";

    document.querySelectorAll(".favorite-button").forEach(button => {
        const product = products.find(
            item => item.id === button.dataset.productId
        );

        if (!product) return;

        const isSaved = favorites.includes(product.id);

        button.textContent = (isSaved ? "Remove " : "Save ") + product.name;
        button.setAttribute("aria-pressed", String(isSaved));
    });
}

function toggleFavorite(productId) {
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
    } else {
        favorites.push(productId);
    }

    saveFavorites();
    renderFavorites();
}

function initializeFavorites() {
    // Only run this feature on the Products page.
    if (!document.getElementById("favorites-list")) return;

    loadFavorites();
    renderFavorites();

    document.querySelectorAll(".favorite-button").forEach(button => {
        button.addEventListener("click", () => {
            toggleFavorite(button.dataset.productId);
        });
    });
}

initializeFavorites();
// Show or clear an error beside a field.
function showFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    error.textContent = message;

    if (message) {
        field.setAttribute("aria-invalid", "true");
    } else {
        field.removeAttribute("aria-invalid");
    }
}

// Check the required fields and collect any errors.
function validateContactForm() {
    const name = document.getElementById("customer-name").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const request = document.getElementById("request-type").value;
    const details = document.getElementById("item-details").value.trim();

    const checks = [
        {
            fieldId: "customer-name",
            errorId: "name-error",
            message: name.length < 2
                ? "Please enter a name with at least 2 characters."
                : ""
        },
        {
            fieldId: "customer-email",
            errorId: "email-error",
            message: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? "Please enter an email such as name@example.com."
                : ""
        },
        {
            fieldId: "request-type",
            errorId: "request-error",
            message: !["preorder", "question"].includes(request)
                ? "Please choose a request type."
                : ""
        },
        {
            fieldId: "item-details",
            errorId: "details-error",
            message: details.length < 10
                ? "Please enter at least 10 characters in your details."
                : ""
        }
    ];

    checks.forEach(check => {
        showFieldError(check.fieldId, check.errorId, check.message);
    });

    return checks.filter(check => check.message !== "");
}

// Connect validation to the Contact form.
function initializeContactForm() {
    const form = document.getElementById("contact-form");

    // Other pages do not contain this form.
    if (!form) return;

    const status = document.getElementById("form-status");
    let attemptedSubmit = false;

    // Use our inline messages instead of browser pop-up messages.
    form.noValidate = true;

    form.addEventListener("submit", event => {
        event.preventDefault();
        attemptedSubmit = true;

        const errors = validateContactForm();

        if (errors.length > 0) {
            status.textContent =
                "Please correct the highlighted fields. Your entries are kept.";

            document.getElementById(errors[0].fieldId).focus();
            return;
        }

        status.textContent =
            "Your information passed validation. This is a demo; " +
            "no message or order was sent.";
    });

    // Update feedback as the user corrects their entries.
    form.addEventListener("input", () => {
        status.textContent = "";

        if (attemptedSubmit) {
            validateContactForm();
        }
    });

    form.addEventListener("change", () => {
        if (attemptedSubmit) {
            validateContactForm();
        }
    });
}

initializeContactForm();