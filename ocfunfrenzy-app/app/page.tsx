import EventsGrid from "@/components/EventsGrid"

export default function Home() {
  return (
    <div>
      <div className="text-4xl sm:text-5xl text-center">
        Looking for a new adventure this weekend in Orange County, California?
      </div>
      <div className="text-gray-500 text-center text-xl mt-4">
        Search for an adventure below!
      </div>
      <EventsGrid />
    </div>
  )
}