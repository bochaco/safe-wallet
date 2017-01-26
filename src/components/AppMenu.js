import React from 'react';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import Autorenew from 'material-ui/svg-icons/action/autorenew';
import '../css/AppMenu.css';
import { Menu, Flag, Dropdown } from 'semantic-ui-react'

export default class AppMenu extends React.Component {
  constructor(props) {
    super(props);

    this.langOptions = [
      { value: 'en', text: 'English', flag: 'gb' },
      { value: 'es', text: 'Español', flag: 'es' },
      { value: 'cn', text: 'Chinese', flag: 'cn', disabled: true },
    ]

    this.handleChangeLang = this.handleChangeLang.bind(this);
  }

  handleChangeLang(event, data) {
    this.props.handleChangeLang(data.value);
  }

  render() {
    let flagName;
    switch(this.props.lang) {
      case 'en':
        flagName = 'gb';
        break;
      case 'es':
        flagName = 'es'
        break;
      case 'cn':
        flagName = 'cn';
        break;
      default:
    }
    let trigger = <Flag name={flagName} />

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
            {this.props.isAuthorised &&
            <div>
              <IconButton onClick={this.props.handleOpenAddModal}><AddCircleOutline color='white' /></IconButton>
              <IconButton onClick={this.props.handleRefresh}><Autorenew color='white' /></IconButton>
            </div>
            }
            <IconButton onClick={this.props.handleOpenAboutModal}><InfoOutline color='white' /></IconButton>
          </Menu.Item>
          <Menu.Item>
            <Dropdown
              options={this.langOptions}
              onChange={this.handleChangeLang}
              trigger={trigger}
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
