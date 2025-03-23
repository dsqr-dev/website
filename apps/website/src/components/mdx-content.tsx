import React from 'react'
import { mdxComponents, Important, Note, Tip, Warning, Caution } from './mdx-components'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MdxContentProps {
  content: string
}

// Parse the markdown to replace custom components with their JSX equivalents
const processMarkdown = (markdown: string): string => {
  // Replace custom component tags with a unique format that React Markdown can parse
  let processedContent = markdown
    // First remove any import statements
    .replace(/import.*from.*;\n?/g, '')
    
    // Process each callout type with a single paragraph format
    .replace(/<Important>([\s\S]*?)<\/Important>/g, (_, content) => {
      // Join all lines to ensure they're treated as a single paragraph
      const formattedContent = content.trim().split('\n').join(' ');
      return `:::important\n${formattedContent}\n:::`;
    })
    .replace(/<Note>([\s\S]*?)<\/Note>/g, (_, content) => {
      const formattedContent = content.trim().split('\n').join(' ');
      return `:::note\n${formattedContent}\n:::`;
    })
    .replace(/<Tip>([\s\S]*?)<\/Tip>/g, (_, content) => {
      const formattedContent = content.trim().split('\n').join(' ');
      return `:::tip\n${formattedContent}\n:::`;
    })
    .replace(/<Warning>([\s\S]*?)<\/Warning>/g, (_, content) => {
      const formattedContent = content.trim().split('\n').join(' ');
      return `:::warning\n${formattedContent}\n:::`;
    })
    .replace(/<Caution>([\s\S]*?)<\/Caution>/g, (_, content) => {
      const formattedContent = content.trim().split('\n').join(' ');
      return `:::caution\n${formattedContent}\n:::`;
    });
  
  return processedContent;
}

export function MdxContent({ content }: MdxContentProps) {
  // Handle case where content might be undefined or null
  if (!content) {
    console.warn("MDX content is empty or undefined")
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 my-6 rounded-r">
        <div className="font-medium text-yellow-800 dark:text-yellow-200">
          Content could not be loaded.
        </div>
      </div>
    )
  }
  
  const processedContent = processMarkdown(content)
  
  try {
    return (
      <div className="mdx prose dark:prose-invert prose-pre:p-0 prose-code:text-sm prose-code:font-normal w-full max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
          components={{
            ...mdxComponents,
            // Handle code blocks with syntax highlighting
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '')
              const codeString = String(children).replace(/\n$/, '')
              
              // Generate a unique ID for each code block to allow multiple copy buttons
              const blockId = `code-block-${Math.random().toString(36).substring(2, 9)}`
              
              const copyToClipboard = () => {
                navigator.clipboard.writeText(codeString)
                  .then(() => {
                    const copyButton = document.getElementById(blockId)
                    if (copyButton) {
                      copyButton.innerText = 'Copied!'
                      setTimeout(() => {
                        copyButton.innerText = 'Copy'
                      }, 2000)
                    }
                  })
                  .catch(err => console.error('Failed to copy: ', err))
              }
              
              return !inline && match ? (
                <div className="relative rounded-lg overflow-hidden my-6 shadow-md">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-mono">
                    <span className="text-gray-500 dark:text-gray-400">{match[1]}</span>
                    <button 
                      id={blockId}
                      onClick={copyToClipboard}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none"
                    >
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                    showLineNumbers={true}
                    customStyle={{
                      backgroundColor: 'rgb(22, 24, 29)',
                      padding: '1.25rem',
                      margin: 0,
                      borderRadius: 0
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: 'JetBrains Mono, Monaco, Menlo, Consolas, monospace',
                        fontSize: '0.875rem',
                        lineHeight: 1.6
                      }
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-gray-200 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            },
            // Custom parser for React Markdown to detect our special formats
            p(props) {
              const { children } = props;
              const childrenArray = React.Children.toArray(children);
              
              // Check if this paragraph is a callout block
              if (childrenArray[0] && typeof childrenArray[0] === 'string') {
                const text = childrenArray[0].toString();
                
                // Helper function to extract content and handle any potential formatting issues
                const extractCalloutContent = (prefix: string) => {
                  // Remove the prefix marker and any trailing marker in one step
                  // This ensures we capture all content between markers as a single block
                  return text.replace(new RegExp(`^:::${prefix}\\s*`), '')
                    .replace(/\s*:::$/, '')
                    .trim();
                };
                
                if (text.startsWith(':::important')) {
                  return <Important>{extractCalloutContent('important')}</Important>;
                }
                if (text.startsWith(':::note')) {
                  return <Note>{extractCalloutContent('note')}</Note>;
                }
                if (text.startsWith(':::tip')) {
                  return <Tip>{extractCalloutContent('tip')}</Tip>;
                }
                if (text.startsWith(':::warning')) {
                  return <Warning>{extractCalloutContent('warning')}</Warning>;
                }
                if (text.startsWith(':::caution')) {
                  return <Caution>{extractCalloutContent('caution')}</Caution>;
                }
              }
              
              // If not a special block, render as normal paragraph
              return <p {...props} />;
            }
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    )
  } catch (error) {
    console.error("Error in MDX component:", error)
    
    // Return a meaningful error message
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded">
        <p className="text-red-800 dark:text-red-200">
          Error rendering content: {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <p className="text-sm text-red-700 dark:text-red-300 mt-2">
          This might be due to missing content generation in the build process.
        </p>
      </div>
    )
  }
}