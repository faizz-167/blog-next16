"use client"
import React, {useTransition} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {blogSchema} from "@/schemas/blog";
import z from "zod";
import {Textarea} from "@/components/ui/textarea";
import {createBlogAction} from "@/lib/actions";
import {toast} from "sonner";
import {Id} from "@/convex/_generated/dataModel";

const Page = () => {
    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            content: "",
            image: undefined
        }
    })
    // client component (Page)

    const onSubmit = (data: z.infer<typeof blogSchema>) => {
        startTransition(async () => {
            const file = data.image as File | undefined;

            try {
                let storageId: Id<"_storage">;

                if (file) {
                    // 1. Get upload URL (Convex returns STRING)
                    const urlRes = await fetch("/api/upload-url", { method: "POST" });
                    if (!urlRes.ok) throw new Error("Failed to get upload URL");

                    const uploadUrl: string = await urlRes.json();

                    // 2. Upload file
                    const uploadResult = await fetch(uploadUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": file.type,
                        },
                        body: file,
                    });

                    if (!uploadResult.ok) {
                        throw new Error("File upload failed");
                    }

                    // 3. Extract storageId
                    const { storageId: id } = await uploadResult.json();
                    storageId = id;
                }

                // 4. Create blog (auth-protected)
                await createBlogAction({
                    title: data.title,
                    content: data.content,
                    imageStorageId: storageId,
                });

            } catch (err) {
                console.error("Upload/create blog error:", err);
                toast.error("Upload failed");
            }
        });
    };



    return (
        <main className="py-12">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Create Post</h1>
                <p className="mt-4 text-xl text-muted-foreground leading-8">Share Your own thoughts to the world</p>
            </div>
                <Card className="w-full max-w-xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">Create Blog Article</CardTitle>
                        <CardDescription>Create your own blog article.....</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your title" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter your content" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Thumbnail</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        field.onChange(file)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button className="w-full" type="submit" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin"/>
                                        </>
                                    ) : "Create Post"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
        </main>
    )
}
export default Page
