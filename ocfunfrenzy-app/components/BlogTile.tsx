import Image from "next/image";

interface BlogTileProps {
    title: string;
    date: string;
    category: string;
    imageUrl: string;
}

export default function BlogTile({ title, date, category, imageUrl }: BlogTileProps) {
    return (
        <div className="w-70">
            <Image src={imageUrl} alt={title} width={300} height={300} className="rounded-md w-full h-70 object-cover" />
            <div className="text-2xl my-2 mx-1">{title}</div>
            <div className="flex justify-between">
                <div className="bg-gray-300 rounded-full px-4 py-0.5">{category}</div>
                <div className="">{date}</div>
            </div>
        </div>
    )
}