import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from '@mui/material';

interface WithoutStylesMarkdownContentProps {
  markdownText: string | undefined;
}

function WithoutStylesMarkdownContent({ markdownText }: WithoutStylesMarkdownContentProps) {
  return (
    <div data-cy="withoutstyles-markdown-text">
      {markdownText && (
        <ReactMarkdown
          components={{
            a: ({ children, href, title }) => (
              <Link href={href} target="_blank">
                <span title={title}>{children}</span>
              </Link>
            ),
          }}
        >
          {markdownText}
        </ReactMarkdown>
      )}
    </div>
  );
}

export default WithoutStylesMarkdownContent;
