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
import { ContentApi } from '../i18n/read-content.js';
import { Constants } from '../common.js';

export default class AppMenu extends React.Component {
  constructor(props) {
    super(props);

    const langs = ContentApi.langsEnabled();
    this.langOptions = langs.map((lang) => ({
        value: lang.lang,
        text: lang.text,
        flag: lang.flag
    }));

    this.handleChangeLang = this.handleChangeLang.bind(this);
  }

  handleChangeLang(event, data) {
    this.props.handleChangeLang(data.value);
  }

  render() {
    const flagName = this.langOptions.filter(obj => obj.value === this.props.lang)[0].flag;
    let trigger = <Flag name={flagName} />

    return (
      <Menu id='appMenu' inverted borderless>
        <Menu.Item>
          {this.props.appState === Constants.APP_STATE_AUTHORISING
            ? <IconButton>
                <CircularProgress color='#00bcd4' size={25} thickness={2} />
              </IconButton>
            : <IconButton onClick={this.props.handlePower}>
                {this.props.appState === Constants.APP_STATE_CONNECTED
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
            {this.props.appState === Constants.APP_STATE_CONNECTED &&
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
