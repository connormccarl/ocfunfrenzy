import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center max-h-screen">
        <span className="text-6xl">404</span>
        <p className="text-lg">We could not find what you are looking for.</p>
        <Link href="/" className="hover:underline flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
            <span className="ml-1">Return Home</span>
        </Link>
    </div>
  )
}