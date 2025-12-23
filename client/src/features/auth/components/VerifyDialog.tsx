"use client"

import Link from "next/link"
import { ArrowLeft, RefreshCw, Loader2, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"

export default function VerifyDialog() {


    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-background">
            <Card className="w-full max-w-md border shadow-sm">
                <CardHeader className="space-y-6 pb-8">
               
                    <div className="space-y-2 text-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight">Check Your Email</CardTitle>
                        <CardDescription className="text-base leading-relaxed text-muted-foreground">
                            We've sent a verification link to your inbox. Please click the link to activate your account and get
                            started.
                        </CardDescription>
                    </div>
                </CardHeader>
      
                <CardFooter className="flex flex-col gap-3 border-t pt-6">
        
                    <Link
                        href="/login"
                        className="flex w-full items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
