import Image from "next/image"

export default function SingleBlogPage() {
    const data = {
        title: "The Most Popular Ride at Disneyland",
        date: "March 15, 2024",
        category: "Trivia",
        imageUrl: "/blog/Space-mtn-1.jpg",
        content: "<p>Space Mountain is the most popular ride at Disneyland, known for its thrilling indoor roller coaster experience that simulates a journey through outer space. The ride features sharp turns, sudden drops, and high speeds, all set in a dark environment with starry effects and space-themed music. It has been a favorite among visitors of all ages since it first opened in 1977.</p>"
    }

    return (
        <div>
            <Image src={data.imageUrl} alt={data.title} width={300} height={300} className="rounded-md w-full h-70 object-cover object-top" />
            <div className="text-3xl my-2 mx-1 text-center">{data.title}</div>
            <div className="flex justify-between gap-6 w-fit mx-auto">
                <div className="bg-gray-300 rounded-full px-4 py-0.5 w-fit mx-1">{data.category}</div>
                <div className="mx-1">{data.date}</div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: data.content }} className="mt-4 text-lg text-gray-700" />
        </div>
    )
}