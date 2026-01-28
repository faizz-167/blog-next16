import React, {useState} from 'react'
import {Loader2, Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Link from "next/link";
import {ROUTES} from "@/constants/Routes";

export const GlobalSearch = () => {
    const [term, setTerm] = useState("")
    const [open, setOpen] = useState(false)
    const results =useQuery(api.blogs.searchPost, term.length >= 2 ? {limit: 5, term} : "skip")
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTerm(e.target.value)
        setOpen(true)
    }

    return (
        <div className="relative w-full max-w-sm">
            <div className="relative">
                <Search className="absolute left-2.5 top-2 size-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-8 bg-background"
                    value={term}
                    onChange={handleInputChange}
                />
            </div>
            {open && term.length >= 2 && (
                <div className="absolute top-full mt-2 border-b bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 w-full">
                    {results === undefined ? (
                        <div className="flex items-center justify-center w-full text-xs text-muted-foreground">
                            <Loader2 className="animate-spin size-4" />
                            <p>Loading...</p>
                        </div>
                    ): results.length === 0 ? (
                        <p className="text-xs text-muted-foreground p-2">No results found</p>
                    ): (
                        <div className="py-1">
                            {results.map((blog) => (
                                <Link
                                    className="flex flex-col px-4 py-2 text-sm hover:bg-accent/15 cursor-pointer"
                                    href={ROUTES.BLOG(blog._id)}
                                    key={blog._id}
                                    onClick={() => setOpen(false)}
                                >
                                    <p className="font-medium truncate">{blog.title}</p>
                                    <p className="text-xs text-muted-foreground">{blog.content.slice(0, 50)}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
