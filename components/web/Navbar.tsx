"use client";

import React from 'react'
import Link from "next/dist/client/link";
import {Links} from "@/constants";
import {Button, buttonVariants} from "@/components/ui/button";
import {ROUTES} from "@/constants/Routes";
import {ThemeToggle} from "@/components/web/ThemeToggle";
import {useConvexAuth} from "convex/react";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export const Navbar = () => {

    const {isAuthenticated, isLoading} = useConvexAuth()
    const router = useRouter()

    return (
        <nav className="w-full py-5 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href={ROUTES.HOME} >
                    <h1 className="text-3xl font-bold">Next<span className="text-primary">Blog</span></h1>
                </Link>
                <div className="flex items-center gap-2">
                    {
                        Links.map((link) => (
                            <Link href={link.route} key={link.name} className={buttonVariants({ variant: "ghost" })}>{link.name}</Link>
                        ))
                    }
                </div>
            </div>
            <div className="flex items-center gap-2">
                { isLoading ? null : isAuthenticated ? (
                    <Button onClick={() => authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                toast.success("You have been signed out successfully")
                                router.push(ROUTES.HOME);
                            },
                            onError: (error) => {
                                toast.error(error.error.message || "Failed to sign out")
                            }
                        }
                    })} >Logout</Button>
                ):(
                    <>
                        <Link href={ROUTES.SIGN_UP} className={buttonVariants()}>Sign Up</Link>
                        <Link href={ROUTES.SIGN_IN} className={buttonVariants({ variant: "outline" })}>Sign In</Link>
                    </>
                )}
                <ThemeToggle />
            </div>
        </nav>
    )
}
