import { defineDocumentType, makeSource } from "contentlayer/source-files"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkGfm from "remark-gfm"

// Manually define our own Node type instead of importing from unist
interface UnistNode {
  type: string
  tagName?: string
  value?: string
  name?: string
  properties?: {
    className?: string[] 
    [key: string]: any
  }
  attributes?: {
    [key: string]: any
  }
  children?: UnistNode[]
  data?: {
    [key: string]: any
  }
  position?: {
    start: { line: number; column: number; offset: number }
    end: { line: number; column: number; offset: number }
  }
}

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
      required: true,
    },
    category: {
      type: "enum",
      options: ["TIL", "Blog", "Life"],
      required: true,
    },
    description: {
      type: "string",
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("posts/", ""),
    },
    url: {
      type: "string",
      resolve: (doc) => `/posts/${doc._raw.flattenedPath.replace("posts/", "")}`,
    },
  },
}))

export default makeSource({
    contentDirPath: "./content",
    documentTypes: [Post],
    mdx: {
      remarkPlugins: [remarkGfm as any],
      rehypePlugins: [
        rehypeSlug as any,
        [
          rehypePrettyCode as any,
          {
            theme: "github-dark",
            keepBackground: true,
            // Add explicit support for Nix
            languageMapping: {
              nix: 'nix'
            },
            onVisitLine(node: UnistNode) {
              // Prevent lines from collapsing in `display: grid` mode, and allow empty
              // lines to be copy/pasted
              if (node.children?.length === 0) {
                node.children = [{ type: "text", value: " " }]
              }
            },
            onVisitHighlightedLine(node: UnistNode) {
              if (node.properties?.className) {
                node.properties.className.push("line--highlighted")
              }
            },
            onVisitHighlightedWord(node: UnistNode) {
              if (node.properties) {
                node.properties.className = ["word--highlighted"]
              }
            },
          },
        ],
        [
          rehypeAutolinkHeadings as any,
          {
            properties: {
              className: ["subheading-anchor"],
              ariaLabel: "Link to section",
            },
          },
        ],
      ],
    },
  })

