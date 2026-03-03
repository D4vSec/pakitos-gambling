import { useState } from "react"

export default function MyComponent() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button className="btn" onClick={() => setIsOpen(true)}>
                Open modal
            </button>

            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>

                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">Press ESC key or click on ✕ button to close</p>
                    </div>
                </div>
            )}
        </>
    )
}
