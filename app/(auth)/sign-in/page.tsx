"use client"

import React, {useTransition} from 'react'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signInSchema} from "@/schemas/auth";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import z from "zod";
import {toast} from "sonner";
import {ROUTES} from "@/constants/Routes";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";

const SignIn = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition()

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit =  (data: z.infer<typeof signInSchema>) => {
        startTransition(async() => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("You have been signed in successfully")
                        router.push(ROUTES.HOME)
                    },
                    onError: (err) => {
                        toast.error(err.error.message || "Failed to sign in")
                    }
                }
            })
        })
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                <CardDescription>Welcome Back to NextBlog</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your Password" {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit" disabled={isPending}>{isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                            </>
                        ) : "Sign In"}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
export default SignIn
