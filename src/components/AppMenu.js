import React from 'react';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import Autorenew from 'material-ui/svg-icons/action/autorenew';
import '../css/AppMenu.css';
import { Menu } from 'semantic-ui-react'

export default class AppMenu extends React.Component {

  render() {
    return (
      <Menu id="appMenu" inverted borderless size="mini">
        <Menu.Item>
          {this.props.isAuthorised == null
            ? <IconButton>
                <CircularProgress color='white' size={25} thickness={2} />
              </IconButton>
            : <IconButton onClick={this.props.handlePower}>
                {this.props.isAuthorised
                    ? <NavigationClose color="white" />
                    : <PowerSettingsNew color="white" />
                }
              </IconButton>
          }
        </Menu.Item>
        <Menu.Item header as="h2">
          SAFE Wallet
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <IconButton onClick={this.props.handleOpenAddModal}><AddCircleOutline color='white' /></IconButton>
            <IconButton onClick={this.props.handleRefresh}><Autorenew color='white' /></IconButton>
            <IconButton onClick={this.props.handleOpenAboutModal}><InfoOutline color='white' /></IconButton>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
