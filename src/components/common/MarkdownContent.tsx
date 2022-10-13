import React from 'react';
import { Link } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import ReactMarkdown from 'react-markdown';
import strip from 'strip-markdown';

const styles = (theme: CustomTheme) =>
  createStyles({
    nullValue: {
      fontStyle: 'italic',
      textColor: theme.palette.primary.dark,
      color: theme.palette.primary.dark,
    },
    jadeLink: {
      ...theme.mixins.jadeLink,
    },
  });

interface MarkdownContentProps extends WithStyles<typeof styles> {
  markdownText: string | undefined;
  stripMarkdown?: boolean;
  emptyText?: string;
}

function MarkdownContent({
  classes,
  emptyText = '(empty)',
  markdownText,
  stripMarkdown = false,
}: MarkdownContentProps) {
  return (
    <>
      {markdownText && !stripMarkdown && (
        <div data-cy="react-markdown-text">
          <ReactMarkdown
            components={{
              a: ({ children, href, title }) => (
                <Link href={href} target="_blank">
                  <span className={classes.jadeLink} title={title}>
                    {children}
                  </span>
                </Link>
              ),
            }}
          >
            {markdownText}
          </ReactMarkdown>
        </div>
      )}
      {markdownText && stripMarkdown && (
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
          {markdownText}
        </ReactMarkdown>
      )}
      {!markdownText && <span className={classes.nullValue}>{emptyText}</span>}
    </>
  );
}

export default withStyles(styles)(MarkdownContent);
