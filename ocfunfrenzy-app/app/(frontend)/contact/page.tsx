export default function ContactPage() {
    return (
        <div className="max-w-lg mx-auto flex flex-col gap-4 text-center">
            <div className="text-3xl">Contact Us</div>
            <div>Here’s how you can contact us for any questions or concerns.</div>
            <form className="group mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-left">
                    <label htmlFor="firstName" className="block mb-1">First Name <span className="text-red-500 text-lg">*</span></label>
                    <input type="text" id="firstName" name="firstName" required className="px-3 py-2 border-1 rounded-md w-full" />
                </div>
                <div className="text-left">
                    <label htmlFor="lastName" className="block mb-1">Last Name <span className="text-red-500 text-lg">*</span></label>
                    <input type="text" id="lastName" name="lastName" required className="px-3 py-2 border-1 rounded-md w-full" />
                </div>
                <div className="text-left sm:col-span-2">
                    <label htmlFor="email" className="block mb-1">Email <span className="text-red-500 text-lg">*</span></label>
                    <input type="email" id="email" name="email" required className="px-3 py-2 border-1 rounded-md w-full" />
                </div>
                <div className="text-left sm:col-span-2">
                    <label htmlFor="message" className="block mb-1">Message <span className="text-red-500 text-lg">*</span></label>
                    <textarea id="message" name="message" required className="px-3 py-2 border-1 rounded-md w-full h-36"></textarea>
                </div>
                <button type="submit" className="sm:col-span-2 w-full bg-[#f1a236] p-2 rounded-md group-invalid:opacity-30 group-invalid:pointer-events-none">Send</button>
            </form>
        </div>

    )
}