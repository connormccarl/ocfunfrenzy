'use client'

import { useState } from "react"
import { SearchDateRange } from "@connormccarl/nextos/ui"

export default function Test(){
    const [dates, setDates] = useState(() => {
        const today = new Date();

        return { start: today, end: today };
    })

    return (
        <div>
            <SearchDateRange value={dates} onChange={setDates} />
        </div>
    )
}
