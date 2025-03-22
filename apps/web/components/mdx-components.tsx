"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useMDXComponent } from "next-contentlayer/hooks"

const components = {
  Important: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 my-6 rounded-r">
      <div className="font-medium text-yellow-800 dark:text-yellow-200">{children}</div>
    </div>
  ),
  h1: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
  ),
  h2: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
  ),
  h3: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
  ),
  h4: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-lg font-semibold mt-4 mb-2" {...props} />
  ),
  p: ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 my-2" {...props} />
  ),
  ul: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside my-4 ml-2" {...props} />
  ),
  ol: ({ ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside my-4 ml-2" {...props} />
  ),
  li: ({ ...props }: React.HTMLAttributes<HTMLLIElement>) => <li className="my-1" {...props} />,
  blockquote: ({ ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic text-gray-600 dark:text-gray-400"
      {...props}
    />
  ),
  a: ({ href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href.startsWith("/")) {
      return <Link href={href} className="text-primary underline underline-offset-4" {...props} />
    }
    if (href.startsWith("#")) {
      return <a href={href} className="text-primary underline underline-offset-4" {...props} />
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4"
        {...props}
      />
    )
  },
  img: ({ src = "", alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // Extract width/height from props and ensure they are numbers
    const { width: propsWidth, height: propsHeight, ...restProps } = props;
    
    // Use default values or convert to numbers if provided
    const width = typeof propsWidth === 'number' ? propsWidth : 720;
    const height = typeof propsHeight === 'number' ? propsHeight : 400;
    
    return (
      <Image 
        src={src || "/placeholder.svg"} 
        alt={alt} 
        className="rounded-md my-4" 
        width={width} 
        height={height} 
        {...restProps} 
      />
    );
  },
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-gray-300 dark:border-gray-700" {...props} />
  ),
  table: ({ ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  tr: ({ ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b border-gray-300 dark:border-gray-700" {...props} />
  ),
  th: ({ ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="text-left py-2 px-4 font-semibold" {...props} />
  ),
  td: ({ ...props }: React.HTMLAttributes<HTMLTableCellElement>) => <td className="py-2 px-4" {...props} />,
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const match = /language-(\w+)/.exec(className || "")

    return match ? (
      <div className="rounded-md my-6 overflow-hidden dark:bg-gray-900 bg-gray-50">
        <div className="overflow-x-auto">
          <pre className="p-4 text-sm leading-relaxed">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      </div>
    ) : (
      <code className="bg-gray-200 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
        {children}
      </code>
    )
  },
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  // Handle case where code might be undefined or null
  if (!code) {
    return null;
  }
  
  // Use try/catch to handle any errors with MDX component creation
  try {
    const MDXContent = useMDXComponent(code)
    
    if (!MDXContent) {
      console.warn("MDXContent is undefined, returning null");
      return null;
    }
    
    return (
      <div className="mdx prose dark:prose-invert prose-pre:p-0 prose-code:text-sm prose-code:font-normal w-full max-w-none">
        <MDXContent components={components} />
      </div>
    )
  } catch (error) {
    console.error("Error rendering MDX content:", error);
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded">
        <p className="text-red-800 dark:text-red-200">Error rendering content.</p>
      </div>
    );
  }
}

