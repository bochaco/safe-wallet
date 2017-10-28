import React from 'react';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import Autorenew from 'material-ui/svg-icons/action/autorenew';
import { Image, Menu, Flag, Dropdown } from 'semantic-ui-react'
import logo_header from '../img/logo-header-415x98.png';

export default class AppMenu extends React.Component {
  constructor(props) {
    super(props);

    this.langOptions = [
      { value: 'en', text: 'English', flag: 'gb' },
      { value: 'es', text: 'Español', flag: 'es' },
      { value: 'de', text: 'Deutsch', flag: 'de' },
      { value: 'zh', text: '中文', flag: 'cn' },
      { value: 'jp', text: '日本語', flag: 'jp' },
    ]

    this.handleChangeLang = this.handleChangeLang.bind(this);
  }

  handleChangeLang(event, data) {
    this.props.handleChangeLang(data.value);
  }

  render() {
    let flagName = this.props.lang;
    switch(this.props.lang) {
      case 'en':
        flagName = 'gb';
        break;
      case 'zh':
        flagName = 'cn';
        break;
      default:
        break;
    }
    let trigger = <Flag name={flagName} />

    return (
      <Menu id='appMenu' inverted borderless>
        <Menu.Item>
          {this.props.isAuthorised == null
            ? <IconButton>
                <CircularProgress color='#00bcd4' size={25} thickness={2} />
              </IconButton>
            : <IconButton onClick={this.props.handlePower}>
                {this.props.isAuthorised
                    ? <NavigationClose color="#00bcd4" />
                    : <PowerSettingsNew color="#00bcd4" />
                }
              </IconButton>
          }
        </Menu.Item>
        <Menu.Item fitted='vertically'>
          <Image id='logoHdr' src={logo_header} verticalAlign='middle' />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            {this.props.isAuthorised &&
            <div>
              <IconButton onClick={this.props.handleOpenAddModal}><AddCircleOutline color='#00bcd4' /></IconButton>
              <IconButton onClick={this.props.handleRefresh}><Autorenew color='#00bcd4' /></IconButton>
            </div>
            }
            <IconButton onClick={this.props.handleOpenAboutModal}><InfoOutline color='#00bcd4' /></IconButton>
          </Menu.Item>
          <Menu.Item>
            <Dropdown
              options={this.langOptions}
              onChange={this.handleChangeLang}
              defaultValue={this.props.lang}
              trigger={trigger}
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
