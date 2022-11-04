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

interface TextContentProps extends WithStyles<typeof styles> {
  text: string | undefined;
  markdown?: boolean;
  stripMarkdown?: boolean;
  emptyText?: string;
}

function TextContent({
  classes,
  emptyText = '(empty)',
  markdown = false,
  stripMarkdown = false,
  text,
}: TextContentProps) {
  return (
    <>
      {text && !markdown && <div>{text}</div>}
      {text && markdown && !stripMarkdown && (
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
            {text}
          </ReactMarkdown>
        </div>
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
      {!text && <span className={classes.nullValue}>{emptyText}</span>}
    </>
  );
}

export default withStyles(styles)(TextContent);
