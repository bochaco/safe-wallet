import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

class Login extends React.Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton {...this.props} label="Login" />
    );
  }
}

class Logged extends React.Component {
  static muiName = 'IconMenu';

  constructor(props) {
    super(props);

    this.handleMenuActions = this.handleMenuActions.bind(this);
  }

  handleMenuActions(event, child) {
    switch (child.props.primaryText) {
      case "Add New":
        this.props.handleOpenEditModal(null);
        break;
      case "Refresh":
        this.props.handleRefresh();
        break;
      case "About":
        this.props.handleOpenAboutModal();
        break;
      default:

    }
  }

  render() {
    return (
      <IconMenu
        {...this.props}
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        onItemTouchTap={this.handleMenuActions}
      >
        <MenuItem primaryText="Add New" />
        <MenuItem primaryText="Refresh" />
        <MenuItem primaryText="About" />
        <MenuItem primaryText="Sign out" />
      </IconMenu>
    )
  }
}

const styles = {
  menubar: {
    marginBottom: '20px',
  },
  title: {
    cursor: 'pointer',
  },
};

class AppMenu extends React.Component {
  state = {
  };

  handleChange = (event, logged) => {
    this.setState({logged: logged});
  };

  render() {
    return (
      <AppBar
        style={styles.menubar}
        title="SAFE Wallet"
        /*onTitleTouchTap={handleTouchTap}*/
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={this.props.isAuthorised ?
          <Logged handleOpenAboutModal={this.props.handleOpenAboutModal}
            handleOpenEditModal={this.props.handleOpenEditModal}
            handleRefresh={this.props.handleRefresh} />
          : ""/*<Login />*/}
      />
    );
  }
}

export default AppMenu;
