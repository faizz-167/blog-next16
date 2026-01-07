import React from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import Image from "next/image";
import {fetchQuery} from "convex/nextjs";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {ROUTES} from "@/constants/Routes";
import {Separator} from "@/components/ui/separator";

interface Props {
    params: Promise<{
        id: Id<"blog">
    }>
}

const Page = async ({params}: Props) => {
    const {id} = await params;
    const blog = await fetchQuery(api.blogs.getPostById, { id: id })
    if (!blog) {
        return <div>
            <h1 className="text-3xl font-bold text-muted-foreground py-20">No Blogs Found</h1>
        </div>
    }
    return (
        <main className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
            <Link href={ROUTES.BLOGS}>
                <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="size-4" />
                    <span>Back to blogs</span>
                </Button>
            </Link>
            <div className="relative w-full h-100 mb-8 overflow-hidden shadow-sm">
                <Image
                    src={blog.imageUrl ?? "https://images.unsplash.com/photo-1702541660859-ed9f8c632462?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt={blog.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    unoptimized
                />
            </div>
            <div className="space-y-4 flex flex-col">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{blog.title}</h1>
                <p className="text-sm text-muted-foreground">Posted on: {new Date(blog._creationTime).toLocaleDateString()}</p>
            </div>
            <Separator className="my-4" />
            <p className="text-md leading-relaxed text-foreground/90 whitespace-pre-wrap">{blog.content}</p>
            <Separator className="my-4" />
        </main>
    )
}
export default Page
