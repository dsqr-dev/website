"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form"
import me from "@/public/me.png"
import { CheckIcon, Loader2Icon } from "lucide-react"

// Newsletter subscription schema using Zod
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
})

// Type inference for the form values
type NewsletterFormValues = z.infer<typeof newsletterSchema>

// Create a server action file
// This would go in app/actions/newsletter.ts in a real implementation
async function subscribeToNewsletter(email: string) {
  // Mock API call
  // In the future, this will write to your database
  console.log("Subscribing email to newsletter:", email)
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return { success: true }
}

export function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  // Initialize the form with Zod validation
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: NewsletterFormValues) {
    try {
      setStatus("loading")
      
      // Call the server action
      const result = await subscribeToNewsletter(data.email)
      
      if (result.success) {
        setStatus("success")
        form.reset()
      } else {
        throw new Error("Failed to subscribe")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      form.setError("email", { 
        type: "server", 
        message: "Something went wrong. Please try again." 
      })
      setStatus("idle")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted">
        <Image
          src={me}
          alt="0xdsqr"
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="prose dark:prose-invert max-w-none text-center">
        <p className="text-sm sm:text-base leading-relaxed">
          Dad of one. Interested in{" "}
          <span className="text-teal-600 dark:text-teal-400 border-b-2 border-dotted border-teal-600 dark:border-teal-400">
            servers/
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 border-b-2 border-dotted border-indigo-600 dark:border-indigo-400">
            (less)
          </span>
          , developer workflows, and{" "}
          <span className="italic border-b-2 border-dotted border-orange-400 text-orange-600 dark:text-orange-300">
            &quot;the cloud&quot;
          </span>
          . Working on Cloud{" "}
          <span className="text-[#0033A0] dark:text-[#00B4F4] font-medium italic border-b-2 border-dotted border-[#0033A0] dark:border-[#00B4F4]">
            @Goldman Sachs
          </span>
          . Building{" "}
          <Link
            href="https://github.com/yourusername/dsqr"
            className="italic border-b-2 border-dotted border-purple-500 text-purple-500 dark:text-purple-400"
          >
            dsqr
          </Link>
          .
        </p>
        <p className="mt-4 text-sm sm:text-base">I also write sometimes. Stay connected if you want.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md px-4" autoComplete="off">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      className="bg-background border-border"
                      disabled={status === "loading" || status === "success"}
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit"
              className="px-8 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? (
                <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
              ) : status === "success" ? (
                <CheckIcon className="w-4 h-4 mr-2" />
              ) : null}
              {status === "success" ? "Subscribed" : "Subscribe"}
            </Button>
          </div>
          
          {status === "success" && (
            <p className="text-sm text-green-500 mt-2">Thanks for subscribing!</p>
          )}
        </form>
      </Form>
    </div>
  )
}

