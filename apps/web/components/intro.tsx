import Link from "next/link"

export function Intro() {
  return (
    <div className="prose dark:prose-invert max-w-none mb-16">
      <p className="text-lg leading-relaxed">
        Dad of one. Interested in infrastructure <span className="text-muted-foreground">(and serverless)</span>,
        developer workflows (and tooling) and system design, and{" "}
        <span className="italic border-b border-dotted border-current">&quot;the cloud&quot;</span>. Working on the cloud
        development team at <span className="text-[#0033A0] dark:text-[#00B4F4] font-medium">Goldman Sachs</span>. In
        free time building{" "}
        <Link
          href="https://github.com/yourusername/dsqr"
          className="italic border-b border-dotted border-purple-500 text-purple-500 dark:text-purple-400"
        >
          dsqr
        </Link>{" "}
        which is just open source software I build as I fail through my home lab / day to day development workflow.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        It also has stuff for IaC etc. It&apos;s a runtime that has providers to support day to day development
        workflow.
      </p>
    </div>
  )
}

