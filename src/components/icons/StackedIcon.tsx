import React from 'react';
import { withStyles } from '@mui/styles';
import { ClassNameMap, CustomTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';

const styles = (theme: CustomTheme) =>
  ({
    iconContainer: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    icon: {
      zIndex: 2,
      color: theme.palette.primary.light,
      fontSize: theme.typography.h6.fontSize,
    },
    iconBackground: {
      color: theme.palette.primary.main,
      fontSize: `calc(${theme.typography.h6.fontSize} * 2.1)`,
      position: 'absolute',
      '&:hover': {
        color: theme.palette.primary.hover,
        boxShadow: 'none',
      },
    },
  } as const);

type StackedIconProps = {
  classes: ClassNameMap;
  icon: IconDefinition;
  iconBackground: IconDefinition;
  size: string;
};

class StackedIcon extends React.PureComponent<StackedIconProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { classes, icon, iconBackground, size } = this.props;
    return (
      <div className={classes.iconContainer}>
        <FontAwesomeIcon
          className={classes.iconBackground}
          icon={iconBackground || faCircle}
          style={{ fontSize: `calc(${size} * 2)` }}
        />
        <FontAwesomeIcon className={classes.icon} icon={icon} style={{ fontSize: size }} />
      </div>
    );
  }
}

export default withStyles(styles)(StackedIcon);
