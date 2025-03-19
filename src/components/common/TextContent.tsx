import React from 'react';
import { Box, Link } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import strip from 'strip-markdown';
import { JadeLinkInline } from 'components/common/JadeLink';

interface TextContentProps {
  readonly text: string | undefined;
  readonly markdown?: boolean;
  readonly stripMarkdown?: boolean;
  readonly emptyText?: string;
}

function TextContent(componentProps: TextContentProps) {
  const { emptyText = '(empty)', markdown = false, stripMarkdown = false, text } = componentProps;
  return (
    <>
      {text && !markdown && <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</Box>}
      {text && markdown && !stripMarkdown && (
        <Box data-cy="react-markdown-text">
          <ReactMarkdown
            components={{
              a: ({ children, href, title }) => (
                <Link href={href} target="_blank">
                  <JadeLinkInline title={title}>{children}</JadeLinkInline>
                </Link>
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        </Box>
      )}
      {text && markdown && stripMarkdown && (
        <ReactMarkdown
          remarkPlugins={[strip]}
          components={{
            p: (props: any) =>
              // eslint-disable-next-line react/prop-types
              props.children
                // eslint-disable-next-line react/prop-types
                .filter((child: any) => child && typeof child === 'string')
                .map((child: any) => `${child}`)
                .join(' '),
          }}
        >
          {text}
        </ReactMarkdown>
      )}
      {!text && (
        <Box
          component="span"
          data-cy="react-markdown-empty-text"
          sx={{
            fontStyle: 'italic',
            textColor: (theme) => theme.palette.primary.dark,
            color: (theme) => theme.palette.primary.dark,
          }}
        >
          {emptyText}
        </Box>
      )}
    </>
  );
}

export default TextContent;
