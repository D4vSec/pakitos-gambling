"use strict"
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // asegúrate de cubrir todos tus componentes
    ],
    safelist: [
        "btn-primary",
        "btn-secondary",
        "btn-accent",
        "btn-neutral",
        "btn-info",
        "btn-success",
        "btn-warning",
        "btn-error",
        "btn-ghost",
        "btn-sm",
        "btn-md",
        "btn-lg",
    ],
    plugins: [require("daisyui")],
}
