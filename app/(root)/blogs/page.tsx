import React, {Suspense} from 'react'
import {api} from "@/convex/_generated/api";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import Image from 'next/image'
import Link from "next/link";
import {ROUTES} from "@/constants/Routes";
import {fetchQuery} from "convex/nextjs";
import {Skeleton} from "@/components/ui/skeleton";

export const dynamic = "force-static";
// export const revalidate = 60; - revalidate the page every 60 seconds

const Page = () => {
    // const blogs = useQuery(api.blogs.getBlogs) --CSR
    return (
        <main className="py-12">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our Blogs</h1>
                <p className="mt-4 text-xl text-muted-foreground leading-8">Insights, thoughts, and trends from our team.</p>
            </div>
            <Suspense fallback={<Loading    />}>
                <LoadingBlogList />
            </Suspense>
        </main>
    )
}
export default Page

const Loading = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_,i) => (
            <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full" />
                <div className='space-y-2 flex flex-col'>
                    <Skeleton className='h-6 w-3/5' />
                    <Skeleton className='h-4 w-3/4' />
                    <Skeleton className='h-4 w-full' />
                </div>
            </div>
        ))}
    </div>
)

const LoadingBlogList = async () => {
    const blogs = await fetchQuery( api.blogs.getBlogs )
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs?.map((blog) => (
                <Card key={blog._id} className="pt-1 px-1">
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image
                            src={blog.imageUrl ?? "https://images.unsplash.com/photo-1702541660859-ed9f8c632462?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent>
                        <Link href={ROUTES.BLOG(blog._id)}>
                            <h1 className="text-2xl font-semibold hover:text-primary">{blog.title}</h1>
                        </Link>
                        <p className="text-muted-foreground line-clamp-3">{blog.content}</p>
                    </CardContent>
                    <CardFooter>
                        <Link className="bg-primary text-primary-foreground [a]:hover:bg-primary/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-none border border-transparent bg-clip-padding text-xs font-medium focus-visible:ring-1 aria-invalid:ring-1 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none" href={ROUTES.BLOG(blog._id)}>Read More..</Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}