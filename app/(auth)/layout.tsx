import {ReactNode} from 'react'
import Link from 'next/link'
import {ROUTES} from "@/constants/Routes";
import {ArrowLeft} from "lucide-react";
import {buttonVariants} from "@/components/ui/button";

const Layout = ({children}: {children: ReactNode}) => {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="absolute top-5 left-5">
                <Link href={ROUTES.HOME} className={buttonVariants()}>
                    <ArrowLeft className="size-4" />
                    Go Back
                </Link>
            </div>
            <div className="w-full max-w-md mx-auto">
                {children}
            </div>
        </main>
    )
}
export default Layout
