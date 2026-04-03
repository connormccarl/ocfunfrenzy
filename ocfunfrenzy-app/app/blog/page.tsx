import BlogTile from "@/components/BlogTile"

export default function BlogPage() {
    const tileData = [
        {
            title: "The Most Popular Ride at Disneyland",
            date: "March 15, 2024",
            category: "Trivia",
            imageUrl: "/blog/Space-mtn-1.jpg"
        },
        {
            title: "The History of Disneyland in Orange County, California: From Dream to Reality",
            date: "March 22, 2024",
            category: "History",
            imageUrl: "/blog/Disneyland.jpg"
        },
        {
            title: "The History of Disneyland in Orange County, California: From Dream to Reality",
            date: "March 22, 2024",
            category: "History",
            imageUrl: "/blog/Disneyland.jpg"
        },
        {
            title: "The History of Disneyland in Orange County, California: From Dream to Reality",
            date: "March 22, 2024",
            category: "History",
            imageUrl: "/blog/Disneyland.jpg"
        },
        {
            title: "The History of Disneyland in Orange County, California: From Dream to Reality",
            date: "March 22, 2024",
            category: "History",
            imageUrl: "/blog/Disneyland.jpg"
        }
    ]

    return (
        <div className="grid justify-items-center space-y-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {tileData.map((tile, index) => (
                <BlogTile key={index} {...tile} />
            ))}
        </div>
    )
}