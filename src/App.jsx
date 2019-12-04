import React from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

// Components
import QuestionList from './components/QuestionList'
import QuestionDetail from './components/QuestionDetail'
import NotificationsViewer from './components/NotificationsViewer';

const AppDisplay =  ({ route }) => (
    <div>
        <div>
            <Link to={`/`}>
                <h1>Isomorphic React</h1>
            </Link>
        </div>
        <div>
            <NotificationsViewer/>
        </div>
        {renderRoutes(route.routes)}
    </div>
);

const mapStateToProps = (state,ownProps)=>({
  ...state,
});

const component = connect(mapStateToProps)(AppDisplay);

export default {
  component
}
