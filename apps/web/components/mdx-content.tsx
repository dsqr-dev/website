import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import Image from "next/image"

interface MDXContentProps {
  content: string
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <ReactMarkdown
      components={{
        h1: (props) => <h1 className="text-2xl font-bold mt-8 mb-4" {...props} />,
        h2: (props) => <h2 className="text-xl font-semibold mt-8 mb-4" {...props} />,
        h3: (props) => <h3 className="text-lg font-medium mt-6 mb-3" {...props} />,
        p: (props) => <p className="leading-relaxed mb-6" {...props} />,
        ul: (props) => <ul className="list-disc list-inside mb-6 space-y-2" {...props} />,
        ol: (props) => <ol className="list-decimal list-inside mb-6 space-y-2" {...props} />,
        li: (props) => <li className="leading-relaxed" {...props} />,
        img: (props) => (
          <div className="my-6">
            <Image src={props.src || ""} alt={props.alt || ""} width={800} height={400} className="rounded-lg" />
          </div>
        ),
        code: ({ inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "")
          return !inline && match ? (
            <div className="my-6 overflow-hidden rounded-lg bg-[#1E1E1E] shadow-lg">
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                showLineNumbers={false}
                customStyle={{
                  margin: 0,
                  padding: "1.5rem",
                  background: "#1E1E1E",
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="bg-gray-200 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
              {children}
            </code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

