import { Link } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import React from 'react';
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

interface HtmlATagProps {
  children?: [];
  href?: string;
  title?: string;
}

function MarkdownContent({
  classes,
  emptyText = '(empty)',
  markdownText,
  stripMarkdown = false,
}: MarkdownContentProps) {
  const HTMLCOMPONENTS = {
    a: ({ children, href, title }: HtmlATagProps) => {
      return (
        <Link href={href} target="_blank">
          <span className={classes.jadeLink} title={title}>
            {children}
          </span>
        </Link>
      );
    },
  } as any;

  const FLATCOMPONENTS = {
    p: (props: any) => {
      const r = props.children
        .map(
          (
            child:
              | boolean
              | React.ReactChild
              | React.ReactFragment
              | React.ReactPortal
              | null
              | undefined,
          ) => {
            if (child && typeof child === 'string') {
              return `${child}`;
            }
          },
        )
        .join(' ');
      return r;
    },
  };

  return (
    <>
      {markdownText && !stripMarkdown && (
        <div data-cy="react-markdown-text">
          <ReactMarkdown children={markdownText} components={HTMLCOMPONENTS} />
        </div>
      )}
      {markdownText && stripMarkdown && (
        <ReactMarkdown
          remarkPlugins={[strip]}
          children={markdownText}
          components={FLATCOMPONENTS}
        />
      )}
      {!markdownText && <span className={classes.nullValue}>{emptyText}</span>}
    </>
  );
}

export default withStyles(styles)(MarkdownContent);
