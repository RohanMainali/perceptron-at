// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) CVAT.ai Corporation
// Copyright (C) 2024 Perceptron AI Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { Dispatch, TransitionEvent, useState, useCallback } from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Tabs from 'antd/lib/tabs';
import Layout from 'antd/lib/layout';

import { CombinedState } from 'reducers';
import { DimensionType } from 'cvat-core-wrapper';
import LabelsList from 'components/annotation-page/standard-workspace/objects-side-bar/labels-list';
import { collapseSidebar as collapseSidebarAction } from 'actions/annotation-actions';
import AppearanceBlock from 'components/annotation-page/appearance-block';
import IssuesListComponent from 'components/annotation-page/standard-workspace/objects-side-bar/issues-list';
import AIChatPanel from 'components/annotation-page/standard-workspace/objects-side-bar/ai-chat-panel';

interface OwnProps {
    objectsList: JSX.Element;
}

interface StateToProps {
    sidebarCollapsed: boolean;
    jobInstance: any;
}

interface DispatchToProps {
    collapseSidebar(): void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        annotation: {
            sidebarCollapsed,
            job: { instance: jobInstance },
        },
    } = state;

    return {
        sidebarCollapsed,
        jobInstance,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchToProps {
    return {
        collapseSidebar(): void {
            dispatch(collapseSidebarAction());
        },
    };
}

function ObjectsSideBar(props: StateToProps & DispatchToProps & OwnProps): JSX.Element {
    const {
        sidebarCollapsed, collapseSidebar, objectsList, jobInstance,
    } = props;

    // State for managing panel expansion
    const [isChatExpanded, setIsChatExpanded] = useState(false);

    const collapse = (): void => {
        const [collapser] = window.document.getElementsByClassName('cvat-objects-sidebar');
        const listener = (event: TransitionEvent): void => {
            if (event.target && event.propertyName === 'width' && event.target === collapser) {
                window.dispatchEvent(new Event('resize'));
                (collapser as HTMLElement).removeEventListener('transitionend', listener as any);
            }
        };

        if (collapser) {
            (collapser as HTMLElement).addEventListener('transitionend', listener as any);
        }

        collapseSidebar();
    };

    const handleToggleChat = useCallback(() => {
        setIsChatExpanded((prev) => !prev);
    }, []);

    const is2D = jobInstance ? jobInstance.dimension === DimensionType.DIMENSION_2D : true;

    return (
        <Layout.Sider
            className={`cvat-objects-sidebar ${isChatExpanded ? 'cvat-objects-sidebar-chat-expanded' : ''}`}
            theme='light'
            width={320}
            collapsedWidth={0}
            reverseArrow
            collapsible
            trigger={null}
            collapsed={sidebarCollapsed}
        >
            {/* Collapse Toggle */}
            <span
                className='cvat-objects-sidebar-sider'
                onClick={collapse}
                role='button'
                tabIndex={0}
            >
                {sidebarCollapsed ? <MenuFoldOutlined title='Show' /> : <MenuUnfoldOutlined title='Hide' />}
            </span>

            {/* Main Content Area */}
            <div className={`cvat-objects-sidebar-content ${isChatExpanded ? 'cvat-objects-sidebar-content-collapsed' : ''}`}>
                <Tabs
                    type='card'
                    defaultActiveKey='objects'
                    className='cvat-objects-sidebar-tabs'
                    items={[{
                        key: 'objects',
                        label: 'Objects',
                        children: objectsList,
                    }, {
                        key: 'labels',
                        label: 'Labels',
                        forceRender: true,
                        children: <LabelsList />,
                    }, ...(is2D ? [{ key: 'issues', label: 'Issues', children: <IssuesListComponent /> }] : [])]}
                />
                {!sidebarCollapsed && !isChatExpanded && <AppearanceBlock />}
            </div>

            {/* AI Chat Panel */}
            <AIChatPanel
                isExpanded={isChatExpanded}
                onToggleExpand={handleToggleChat}
            />
        </Layout.Sider>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ObjectsSideBar));
