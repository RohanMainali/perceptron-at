// Copyright (C) Perceptron AI Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { useSelector } from 'react-redux';
import { CombinedState } from 'reducers';
import perceptronLogo from '../../assets/perceptron/perceptron-logo.png';

function CVATLogo(): JSX.Element {
    const serverLogo = useSelector((state: CombinedState) => state.about.server.logoURL);
    // Use Perceptron logo by default, fallback to server logo if needed
    const logo = perceptronLogo || serverLogo;

    return (
        <div className='cvat-logo-icon'>
            <img src={logo} alt='Perceptron' />
        </div>
    );
}

export default React.memo(CVATLogo);
