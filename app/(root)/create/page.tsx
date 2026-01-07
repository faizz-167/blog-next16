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
import {api} from "@/convex/_generated/api";
import {useMutation} from "convex/react";

const Page = () => {
    const [isPending, startTransition] = useTransition()
    const generateUploadUrl = useMutation(api.blogs.generateImageUpload);
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
            try {
                // generateUploadUrl returns a short-lived POST URL (string)
                const postUrl = await generateUploadUrl();
                if (!postUrl || typeof postUrl !== "string") {
                    throw new Error("Invalid upload URL received from server");
                }

                const file = data.image;
                if (!file) {
                    throw new Error("No file selected");
                }
                if (!file.type) {
                    throw new Error("File has no mime type");
                }

                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": file.type,
                        // optional: include a Digest header if you compute it; not required
                    },
                    body: file,
                });

                if (!result.ok) {
                    const text = await result.text();
                    throw new Error(`Upload failed: ${result.status} ${text}`);
                }

                const json = await result.json();
                const storageId = json?.storageId;
                if (!storageId) {
                    throw new Error("Upload response did not contain storageId");
                }

                // Call the server action that saves the small payload (storage id) to DB
                await createBlogAction({
                    title: data.title,
                    content: data.content,
                    imageStorageId: storageId,
                });

                toast.success("Blog created!");
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
