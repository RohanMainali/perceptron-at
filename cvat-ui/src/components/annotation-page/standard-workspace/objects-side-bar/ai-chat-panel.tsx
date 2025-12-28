// Copyright (C) 2024 Perceptron AI Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
    SendOutlined,
    RobotOutlined,
    UserOutlined,
    ExpandOutlined,
    CompressOutlined,
    ClearOutlined,
    SettingOutlined,
    PlayCircleOutlined,
    BorderOutlined,
    HighlightOutlined,
    AimOutlined,
    LineOutlined,
    StarOutlined,
    AppstoreOutlined,
} from '@ant-design/icons';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import Spin from 'antd/lib/spin';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import InputNumber from 'antd/lib/input-number';
import { CombinedState } from 'reducers';

const { TextArea } = Input;

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

interface AnnotationConfig {
    annotationType: 'rectangle' | 'polygon' | 'polyline' | 'points' | 'ellipse' | 'mask' | 'skeleton';
    enableTracking: boolean;
    frameStart: number;
    frameEnd: number;
    selectedLabels: string[];
}

interface AIChatPanelProps {
    isExpanded: boolean;
    onToggleExpand: () => void;
}

const ANNOTATION_TYPES = [
    { value: 'rectangle', label: 'Bounding Box', icon: <BorderOutlined /> },
    { value: 'polygon', label: 'Polygon', icon: <StarOutlined /> },
    { value: 'mask', label: 'Segmentation Mask', icon: <HighlightOutlined /> },
    { value: 'polyline', label: 'Polyline', icon: <LineOutlined /> },
    { value: 'points', label: 'Points', icon: <AimOutlined /> },
    { value: 'ellipse', label: 'Ellipse', icon: <AppstoreOutlined /> },
];

function AIChatPanel({ isExpanded, onToggleExpand }: AIChatPanelProps): JSX.Element {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your AI annotation assistant. Configure your settings above, then describe what you want me to annotate.\n\nExample: "Detect and segment all cats in this video" or "Find all vehicles and track them"',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfig, setShowConfig] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<any>(null);

    const [config, setConfig] = useState<AnnotationConfig>({
        annotationType: 'rectangle',
        enableTracking: false,
        frameStart: 0,
        frameEnd: 100,
        selectedLabels: [],
    });

    const jobInstance = useSelector((state: CombinedState) => state.annotation.job.instance);
    const labels = useSelector((state: CombinedState) => state.annotation.job.labels);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isExpanded]);

    useEffect(() => {
        if (jobInstance) {
            setConfig((prev) => ({
                ...prev,
                frameStart: jobInstance.startFrame || 0,
                frameEnd: jobInstance.stopFrame || 100,
            }));
        }
    }, [jobInstance]);

    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const simulateAIResponse = async (userMessage: string): Promise<string> => {
        await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

        const lowerMessage = userMessage.toLowerCase();
        const annotationTypeLabel = ANNOTATION_TYPES.find((t) => t.value === config.annotationType)?.label || config.annotationType;
        const frameRange = `frames ${config.frameStart} to ${config.frameEnd}`;
        const trackingStatus = config.enableTracking ? 'with tracking enabled' : 'without tracking';

        if (lowerMessage.includes('detect') || lowerMessage.includes('find') || lowerMessage.includes('segment') || lowerMessage.includes('annotate')) {
            const objectMatch = lowerMessage.match(/(?:detect|find|segment|annotate)\s+(?:all\s+)?(?:the\s+)?(\w+)/i);
            const targetObject = objectMatch ? objectMatch[1] : 'objects';

            return `🚀 **Starting AI Annotation Task**\n\n` +
                `**Configuration:**\n` +
                `• Type: ${annotationTypeLabel}\n` +
                `• Target: ${targetObject}\n` +
                `• Range: ${frameRange}\n` +
                `• Tracking: ${config.enableTracking ? '✓ Enabled' : '✗ Disabled'}\n\n` +
                `**Status:** Processing...\n\n` +
                `I'll analyze each frame and create ${annotationTypeLabel.toLowerCase()} annotations for "${targetObject}" ${trackingStatus}.\n\n` +
                `_Note: This is a demo. In production, this would trigger the actual AI model._`;
        }

        if (lowerMessage.includes('track')) {
            return `🎯 **Tracking Configuration**\n\n` +
                `Tracking is currently ${config.enableTracking ? '**enabled**' : '**disabled**'}.\n\n` +
                `When enabled, I'll:\n` +
                `• Assign consistent IDs across frames\n` +
                `• Link detections between consecutive frames\n` +
                `• Maintain object identity throughout the sequence\n\n` +
                `Toggle the "Enable Tracking" checkbox above to change this setting.`;
        }

        if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
            return `📖 **How to Use AI Annotation**\n\n` +
                `1. **Select annotation type** (bounding box, segmentation, etc.)\n` +
                `2. **Set frame range** for batch processing\n` +
                `3. **Enable tracking** if you want consistent IDs\n` +
                `4. **Describe your task** in natural language\n\n` +
                `**Example prompts:**\n` +
                `• "Segment all people in this video"\n` +
                `• "Find and track all vehicles from frame 0 to 500"\n` +
                `• "Detect cats and dogs with bounding boxes"\n` +
                `• "Create polygon masks for all buildings"`;
        }

        return `I understand you want to: "${userMessage}"\n\n` +
            `**Current settings:**\n` +
            `• Annotation: ${annotationTypeLabel}\n` +
            `• Frames: ${frameRange}\n` +
            `• Tracking: ${config.enableTracking ? 'On' : 'Off'}\n\n` +
            `Please be more specific about what objects you want me to detect/annotate.`;
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await simulateAIResponse(inputValue);
            const assistantMessage: Message = {
                id: generateId(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: generateId(),
                role: 'assistant',
                content: '❌ Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        setMessages([{
            id: generateId(),
            role: 'assistant',
            content: 'Chat cleared. Configure your settings and describe what you want me to annotate.',
            timestamp: new Date(),
        }]);
    };

    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const labelOptions = labels?.map((label: any) => ({
        value: label.id,
        label: label.name,
    })) || [];

    return (
        <div className={`cvat-ai-chat-panel ${isExpanded ? 'cvat-ai-chat-panel-expanded' : ''}`}>
            {/* Header */}
            <div
                className='cvat-ai-chat-header'
                onClick={!isExpanded ? onToggleExpand : undefined}
                role='button'
                tabIndex={0}
            >
                <div className='cvat-ai-chat-header-left'>
                    <div className='cvat-ai-chat-icon-wrapper'>
                        <RobotOutlined className='cvat-ai-chat-icon' />
                    </div>
                    <div className='cvat-ai-chat-header-text'>
                        <span className='cvat-ai-chat-title'>AI Annotation Assistant</span>
                        <span className='cvat-ai-chat-subtitle'>
                            {isExpanded ? 'Configure & annotate with AI' : 'Click to expand'}
                        </span>
                    </div>
                </div>
                <div className='cvat-ai-chat-header-actions' onClick={(e) => e.stopPropagation()}>
                    {isExpanded && (
                        <>
                            <Tooltip title='Toggle settings' placement='top'>
                                <Button
                                    type='text'
                                    size='small'
                                    icon={<SettingOutlined />}
                                    onClick={() => setShowConfig(!showConfig)}
                                    className={showConfig ? 'cvat-ai-chat-btn-active' : ''}
                                />
                            </Tooltip>
                            <Tooltip title='Clear chat' placement='top'>
                                <Button
                                    type='text'
                                    size='small'
                                    icon={<ClearOutlined />}
                                    onClick={handleClearChat}
                                />
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title={isExpanded ? 'Collapse' : 'Expand'} placement='top'>
                        <Button
                            type='text'
                            size='small'
                            icon={isExpanded ? <CompressOutlined /> : <ExpandOutlined />}
                            onClick={onToggleExpand}
                        />
                    </Tooltip>
                </div>
            </div>

            {/* Content - only visible when expanded */}
            {isExpanded && (
                <div className='cvat-ai-chat-body'>
                    {/* Configuration Panel */}
                    {showConfig && (
                        <div className='cvat-ai-chat-config'>
                            <div className='cvat-ai-chat-config-section'>
                                <label className='cvat-ai-chat-config-label'>Annotation Type</label>
                                <Select
                                    value={config.annotationType}
                                    onChange={(value) => setConfig({ ...config, annotationType: value })}
                                    className='cvat-ai-chat-config-select'
                                    popupClassName='cvat-ai-chat-config-dropdown'
                                >
                                    {ANNOTATION_TYPES.map((type) => (
                                        <Select.Option key={type.value} value={type.value}>
                                            <span className='cvat-ai-chat-option'>
                                                {type.icon}
                                                <span>{type.label}</span>
                                            </span>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            <div className='cvat-ai-chat-config-row'>
                                <div className='cvat-ai-chat-config-section cvat-ai-chat-config-section-half'>
                                    <label className='cvat-ai-chat-config-label'>Start Frame</label>
                                    <InputNumber
                                        min={0}
                                        max={config.frameEnd}
                                        value={config.frameStart}
                                        onChange={(value) => setConfig({ ...config, frameStart: value || 0 })}
                                        className='cvat-ai-chat-config-input'
                                    />
                                </div>
                                <div className='cvat-ai-chat-config-section cvat-ai-chat-config-section-half'>
                                    <label className='cvat-ai-chat-config-label'>End Frame</label>
                                    <InputNumber
                                        min={config.frameStart}
                                        value={config.frameEnd}
                                        onChange={(value) => setConfig({ ...config, frameEnd: value || 100 })}
                                        className='cvat-ai-chat-config-input'
                                    />
                                </div>
                            </div>

                            <div className='cvat-ai-chat-config-section'>
                                <Checkbox
                                    checked={config.enableTracking}
                                    onChange={(e) => setConfig({ ...config, enableTracking: e.target.checked })}
                                    className='cvat-ai-chat-config-checkbox'
                                >
                                    <span className='cvat-ai-chat-checkbox-label'>
                                        <PlayCircleOutlined />
                                        Enable Tracking
                                        <span className='cvat-ai-chat-checkbox-hint'>Assign consistent IDs across frames</span>
                                    </span>
                                </Checkbox>
                            </div>

                            {labelOptions.length > 0 && (
                                <div className='cvat-ai-chat-config-section'>
                                    <label className='cvat-ai-chat-config-label'>Filter Labels (optional)</label>
                                    <Select
                                        mode='multiple'
                                        allowClear
                                        placeholder='All labels'
                                        value={config.selectedLabels}
                                        onChange={(value) => setConfig({ ...config, selectedLabels: value })}
                                        className='cvat-ai-chat-config-select'
                                        options={labelOptions}
                                        maxTagCount={2}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Messages */}
                    <div className='cvat-ai-chat-messages'>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`cvat-ai-chat-message cvat-ai-chat-message-${message.role}`}
                            >
                                <div className='cvat-ai-chat-message-avatar'>
                                    {message.role === 'assistant' ? <RobotOutlined /> : <UserOutlined />}
                                </div>
                                <div className='cvat-ai-chat-message-content'>
                                    <div className='cvat-ai-chat-message-text'>
                                        {message.content.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line.startsWith('**') && line.endsWith('**') ? (
                                                    <strong>{line.slice(2, -2)}</strong>
                                                ) : line.startsWith('• ') ? (
                                                    <span className='cvat-ai-chat-bullet'>{line}</span>
                                                ) : line.startsWith('_') && line.endsWith('_') ? (
                                                    <em className='cvat-ai-chat-note'>{line.slice(1, -1)}</em>
                                                ) : (
                                                    line
                                                )}
                                                {i < message.content.split('\n').length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className='cvat-ai-chat-message-time'>{formatTime(message.timestamp)}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className='cvat-ai-chat-message cvat-ai-chat-message-assistant'>
                                <div className='cvat-ai-chat-message-avatar'>
                                    <RobotOutlined />
                                </div>
                                <div className='cvat-ai-chat-message-content cvat-ai-chat-loading'>
                                    <Spin size='small' />
                                    <span>Processing your request...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className='cvat-ai-chat-input-container'>
                        <TextArea
                            ref={inputRef}
                            placeholder='Describe what to annotate... e.g., "Segment all cats and track them"'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            autoSize={{ minRows: 1, maxRows: 3 }}
                            disabled={isLoading}
                            className='cvat-ai-chat-input'
                        />
                        <Button
                            type='primary'
                            icon={<SendOutlined />}
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className='cvat-ai-chat-send-button'
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(AIChatPanel);
