"use client"

import React, {useTransition} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {useForm} from "react-hook-form"
import {signUpSchema} from "@/schemas/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import z from "zod";
import {Loader2} from "lucide-react";

const SignUp = () => {
    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })
    const onSubmit = (data: z.infer<typeof signUpSchema>) => {
        startTransition(async () => {
            await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
            })
        })
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                <CardDescription>Sign up to create an account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <Button className="w-full" type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                </>
                            ) : "Sign Up"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
export default SignUp
