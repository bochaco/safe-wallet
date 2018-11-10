// Copyright 2016-2018 Gabriel Viganotti <@bochaco>.
//
// This file is part of the SAFE Wallet application.
//
// The SAFE Wallet is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The SAFE Wallet is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with the SAFE Wallet. If not, see <https://www.gnu.org/licenses/>.

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// The semantic.min.css file is manually being modified
// to load the fonts from /fonts, e.g. in first line we have:
//           @import url(/fonts/Raleway-Regular.ttf); /*!
// TODO: change the config files so this gets added automatically when
// building it with "gulp build"
// TODO: customise it so it includes only the components being used by the app
import './semantic/dist/semantic.min.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
