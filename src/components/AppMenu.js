import React from 'react';
import { IconButton, CircularProgress } from '@material-ui/core';
import { AddCircleOutline, Close, PowerSettingsNew,
          InfoOutlined, Autorenew } from '@material-ui/icons';
import { Image, Menu, Flag, Dropdown } from 'semantic-ui-react'
import logo_header from '../img/logo-header-415x98.png';
import { ContentApi } from '../i18n/read-content.js';
import { Constants } from '../common.js';

const MENU_BUTTON_BG_COLOR = '#00bcd4';

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
                <CircularProgress style={{ color: MENU_BUTTON_BG_COLOR }} size={25} thickness={2} />
              </IconButton>
            : <IconButton onClick={this.props.handlePower}>
                {this.props.appState === Constants.APP_STATE_CONNECTED
                    ? <Close style={{ color: MENU_BUTTON_BG_COLOR }} />
                    : <PowerSettingsNew style={{ color: MENU_BUTTON_BG_COLOR }} />
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
              <IconButton onClick={this.props.handleOpenAddModal}><AddCircleOutline style={{ color: MENU_BUTTON_BG_COLOR }} /></IconButton>
              <IconButton onClick={this.props.handleRefresh}><Autorenew style={{ color: MENU_BUTTON_BG_COLOR }} /></IconButton>
            </div>
            }
            <IconButton onClick={this.props.handleOpenAboutModal}><InfoOutlined style={{ color: MENU_BUTTON_BG_COLOR }} /></IconButton>
          </Menu.Item>
          <Menu.Item>
            <Dropdown
              options={this.langOptions}
              onChange={this.handleChangeLang}
              value={this.props.lang}
              trigger={trigger}
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
