import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from '@mui/material';

interface WithoutStylesMarkdownContentProps {
  markdownText: string | undefined;
}

interface HtmlATagProps {
  children?: [];
  href?: string;
  title?: string;
}

const HTMLCOMPONENTS = {
  a: ({ children, href, title }: HtmlATagProps) => {
    return (
      <Link href={href} target="_blank">
        <span title={title}>{children}</span>
      </Link>
    );
  },
} as any;

function WithoutStylesMarkdownContent({ markdownText }: WithoutStylesMarkdownContentProps) {
  return (
    <>
      {markdownText && (
        <div>
          <ReactMarkdown children={markdownText} components={HTMLCOMPONENTS} />
        </div>
      )}
    </>
  );
}

export default WithoutStylesMarkdownContent;
