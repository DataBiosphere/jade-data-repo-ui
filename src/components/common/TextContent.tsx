import React from 'react';
import { Link, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import strip from 'strip-markdown';

const StyledLink = styled('span')(({ theme }) => ({
  // @ts-ignore
  ...theme.mixins.jadeLink,
}));

interface TextContentProps {
  readonly text: string | undefined;
  readonly markdown?: boolean;
  readonly stripMarkdown?: boolean;
  readonly emptyText?: string;
}

function TextContent(props: TextContentProps) {
  const { emptyText = '(empty)', markdown = false, stripMarkdown = false, text } = props;
  return (
    <>
      {text && !markdown && <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</Box>}
      {text && markdown && !stripMarkdown && (
        <Box data-cy="react-markdown-text">
          <ReactMarkdown
            components={{
              a: ({ children, href, title }) => (
                <Link href={href} target="_blank">
                  <StyledLink title={title}>{children}</StyledLink>
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
            p: (props: any) => {
              const r = props.children
                .filter((child: any) => child && typeof child === 'string')
                .map((child: any) => `${child}`)
                .join(' ');
              return r;
            },
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
