import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import Autorenew from 'material-ui/svg-icons/action/autorenew';

class Logged extends React.Component {
  render() {
    return (
      <div>
        <IconButton onClick={this.props.handleOpenAddModal}><AddCircleOutline color='white' /></IconButton>
        <IconButton onClick={this.props.handleRefresh}><Autorenew color='white' /></IconButton>
        <IconButton onClick={this.props.handleOpenAboutModal}><InfoOutline color='white' /></IconButton>
      </div>
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
  state = {};

  handleChange = (event, logged) => {
    this.setState({logged: logged});
  };

  render() {
    return (
      <AppBar
        style={styles.menubar}
        title="SAFE Wallet"
        /*onTitleTouchTap={handleTouchTap}*/
        iconElementLeft={this.props.isAuthorised == null ?
          <IconButton><CircularProgress color='white' size={25} thickness={2} /></IconButton> :
          <IconButton onClick={this.props.handlePower}>
              {this.props.isAuthorised ? <NavigationClose />
                  : <PowerSettingsNew />}
            </IconButton>}
        iconElementRight={this.props.isAuthorised ?
          <Logged handleOpenAboutModal={this.props.handleOpenAboutModal}
            handleOpenAddModal={this.props.handleOpenAddModal}
            handleRefresh={this.props.handleRefresh} />
          : <div></div>}
      />
    );
  }
}

export default AppMenu;
