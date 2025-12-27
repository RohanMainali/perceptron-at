// Copyright (C) Perceptron AI Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Layout from 'antd/lib/layout';
import { Col, Row } from 'antd/lib/grid';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import {
    CheckCircleOutlined,
    ThunderboltOutlined,
    SafetyOutlined,
} from '@ant-design/icons';
import CVATLogo from 'components/common/cvat-logo';

interface SignInLayoutComponentProps {
    children: JSX.Element | JSX.Element[];
}

interface Sizes {
    xs?: { span: number };
    sm?: { span: number };
    md?: { span: number };
    lg?: { span: number };
    xl?: { span: number };
    xxl?: { span: number };
}

interface FormSizes {
    wrapper: Sizes;
    form: Sizes;
}

export const formSizes: FormSizes = {
    wrapper: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
        xl: { span: 12 },
        xxl: { span: 10 },
    },
    form: {
        xs: { span: 22 },
        sm: { span: 20 },
        md: { span: 18 },
        lg: { span: 16 },
        xl: { span: 20 },
        xxl: { span: 18 },
    },
};

function SignInLayout(props: SignInLayoutComponentProps): JSX.Element {
    const { children } = props;
    const { Content, Header } = Layout;

    const titleSizes = {
        xs: { span: 0 },
        sm: { span: 0 },
        md: { span: 0 },
        lg: { span: 0 },
        xl: { span: 11 },
        xxl: { span: 12 },
    };
    const logoSizes = {
        xs: { span: 22 },
        sm: { span: 22 },
        md: { span: 22 },
        lg: { span: 22 },
        xl: { span: 22 },
        xxl: { span: 22 },
    };

    const features = [
        { icon: <CheckCircleOutlined />, text: 'Precision annotation tools' },
        { icon: <ThunderboltOutlined />, text: 'AI-assisted labeling' },
        { icon: <SafetyOutlined />, text: 'Enterprise-grade security' },
    ];

    return (
        <Layout className='cvat-signing-page-wrapper'>
            <div className='cvat-signing-background' />
            <div className='cvat-signing-glow' />
            <Header className='cvat-signing-header'>
                <Row className='cvat-signing-header-logo-wrapper' justify='center' align='middle'>
                    <Col {...logoSizes}>
                        <CVATLogo />
                    </Col>
                </Row>
            </Header>
            <Layout className='cvat-signing-layout'>
                <Content>
                    <Row justify='center' align='middle' style={{ height: '100%', minHeight: '100vh', padding: '0 24px' }}>
                        <Col {...titleSizes} className='cvat-signing-title'>
                            <Title>AI-Powered</Title>
                            <Title>Data Annotation</Title>
                            <Text style={{
                                fontSize: '16px',
                                fontWeight: 400,
                                color: 'rgba(255, 255, 255, 0.6)',
                                marginTop: '24px',
                                display: 'block',
                                lineHeight: 1.7,
                                maxWidth: '420px',
                            }}>
                                Build better AI models with precision labeling tools designed for modern machine learning workflows.
                            </Text>
                            <div className='cvat-signing-features'>
                                {features.map((feature, index) => (
                                    <div className='feature-item' key={index}>
                                        <div className='feature-icon'>{feature.icon}</div>
                                        <span>{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </Col>
                        {children}
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}

export default SignInLayout;
