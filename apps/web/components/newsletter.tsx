"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import me from "@/public/me.png"

export function Newsletter() {
  const [email, setEmail] = useState("")

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
      <div className="flex w-full max-w-md gap-4 px-4 mt-4">
        <Input
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background border-border"
        />
        <Button className="px-8 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700">
          Subscribe
        </Button>
      </div>
    </div>
  )
}

