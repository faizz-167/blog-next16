"use client"
import React, {useTransition} from 'react'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Loader2, MessageSquare, SendHorizonal} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {commentSchema} from "@/schemas/comment";
import z from "zod";
import {Textarea} from "@/components/ui/textarea";
import {useParams} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";
import {Preloaded, useMutation, usePreloadedQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {toast} from "sonner";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {getInitials} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";

export const CommentsSection = (props: {
    preloadedComments: Preloaded<typeof api.comments.getCommentsByPost>
}) => {
    const [isPending, startTransition] = useTransition()
    const {id} = useParams<{id: Id<"blog">}>()
    const comments = usePreloadedQuery(props.preloadedComments)
    const mutation = useMutation(api.comments.createComment)
    const form = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: "",
            blogId: id
        }
    })
    const onSubmit = (data: z.infer<typeof commentSchema>) => {
        startTransition(async() => {
            try {
                await mutation(data)
                form.reset()
                toast.success("Comment created successfully")
            }catch (e) {
                console.log(e)
                toast.error("Failed to create comment")
            }
        })
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 border-b">
                <MessageSquare className="size-5" />
                <h2 className="text-xl font-semibold">{comments?.length} Comments</h2>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-end">
                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Textarea {...field} placeholder="Share your thoughts"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending}>{isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                            </>
                        ) :
                            <>
                                <SendHorizonal className="size-4" />
                            </>
                        }</Button>
                    </form>
                    {comments?.length === 0 ? (
                        <p className="text-center text-muted-foreground">No comments yet</p>
                    ): (
                        <Separator className="my-4" />
                    )}
                    <section className='space-y-6'>
                        {comments?.map((comment) => (
                            <div key={comment._id} className="flex gap-4">
                                <Avatar className="size-10 shrink-0">
                                    <AvatarImage src={`https://avatar.vercel.sh/${comment.authorName}.svg?text=${getInitials(comment.authorName)}`} alt={comment.authorName} />
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">{comment.authorName}</span>
                                        <p className="text-xs text-muted-foreground">{new Date(comment._creationTime).toLocaleDateString("en-IN", {timeZone: "Asia/Kolkata"})}</p>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">{comment.body}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                </Form>
            </CardContent>
        </Card>
    )
}
