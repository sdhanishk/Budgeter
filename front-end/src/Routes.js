import  React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';

import { appRoutes } from './utils/config';

const Routes = () => {
    return (
        <BrowserRouter>
            <div>
                <Route path={appRoutes.mainPage} exact component={MainPage} />
            </div>
        </BrowserRouter>
    );
}

export default Routes;