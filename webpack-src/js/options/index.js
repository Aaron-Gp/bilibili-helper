/**
 * Author: Ruo
 * Create: 2018-06-12
 * Description:
 */

import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {__, isLogin, createTab, version, setOption, getOptions} from 'Utils';
import {
    Button, Body, List, ListItem, Header, Icon, Modal,
    Radio, RadioButtonGroup, CheckBoxGroup, UpdateList, SubPage,
} from 'Components';

import 'Styles/scss/options.scss';

const OptionBody = styled(Body).attrs({
    className: 'option-body',
})`
  position: absolute;
  //margin: 0 auto 0;
  //padding: 0 3px 56px;
  top: 56px;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
`;

class PageOptions extends React.Component {
    constructor() {
        super();
        /**
         * ! important ! 将配置导入state
         * 此处的getOption会返回当前配置和默认配置来合并的对象
         */
        this.state = Object.assign({}, getOptions(), {
            modalTitle: null,
            modalBody: null,
            modalButtons: null,
            modalOn: false,
            subPageOn: false,
            parent: null,
        });

        this.handleOnClick = ::this.handleOnClick;
        this.handleSetOption = ::this.handleSetOption;
        this.handleSetSubPage = ::this.handleSetSubPage;
    }

    componentWillMount() {

    }

    handleOnClick(type) {
        const {active} = this.state;
        this.setState({active: active === type ? '' : type});
    }

    /**
     * 设置配置
     * @param key 配置名
     * @param value 配置的值
     */
    handleSetOption(key, value) {
        if (this.state[key]) {
            const optionObject = this.state[key];
            if (value == undefined) {
                optionObject.on = !optionObject.on;
            } else {
                optionObject.value = value;
            }
            setOption(key, optionObject);
            this.setState({key: optionObject});
        }
    }

    handleSetSubPage(parent) {
        const {subPageOn, parent: currentParent} = this.state;
        const newState = {};
        if (subPageOn !== undefined) newState.subPageOn = !subPageOn;
        if (currentParent !== parent) newState.parent = parent.ListWrapper.querySelector('.list-body');
        else newState.parent = null;
        this.setState(newState);
    }

    render() {
        const {
            newWatchList,
            dynamicCheck,
            downloadType,
            videoPlayerWidenType,
            sign,
            treasure,
            chatFilter,
            // modal
            modalOn,
            modalTitle,
            modalBody,
            modalButtons,
            // sub page
            subPageOn,
            parent,
        } = this.state;
        return <React.Fragment>
            <Header title="设置"/>
            <OptionBody>
                <SubPage
                    title="Sub Page Title"
                    on={subPageOn}
                    parent={parent}
                    onClose={() => {
                        this.handleSetSubPage(this.mainList);
                    }}
                >
                    <div style={{height: 2000}}></div>
                </SubPage>
                <List
                    title="主站"
                    ref={i => this.mainList = i}
                >
                    <ListItem
                        operation={
                            <Button icon onClick={() => this.handleSetSubPage(this.mainList)}><Icon
                                type="arrowRight"/></Button>
                        }
                    >Sub Page 测试</ListItem>
                    <ListItem
                        onClick={() => this.setState({
                            modalOn: !modalOn,
                            modalTitle: 'Modal 测试标题',
                            modalBody: <div>Modal 测试 body</div>,
                            modalButtons: <Button normal onClick={() => this.setState({modalOn: modalOn})}>关闭</Button>,
                        })}
                        operation={<Radio on={modalOn}/>}
                    >Modal 测试</ListItem>
                    <ListItem
                        onClick={() => this.handleSetOption('newWatchList')}
                        operation={<Radio on={newWatchList.on}/>}
                    >新版关注页面跳转</ListItem>
                    <ListItem
                        onClick={() => this.handleSetOption('dynamicCheck')}
                        operation={<Radio on={dynamicCheck.on}/>}
                    >更新“我的关注”</ListItem>
                    <ListItem
                        onClick={() => this.handleSetOption('downloadType')}
                        operation={<Radio on={downloadType.on}/>}
                        subList={{
                            hide: !downloadType.on,
                            theme: {twoLine: false},
                            children: <RadioButtonGroup
                                value={downloadType.value}
                                data={[
                                    {title: 'FLV优先', value: 'flv'},
                                    {title: 'MP4优先', value: 'mp4'},
                                ]}
                                onClick={(value) => this.handleSetOption('downloadType', value)}
                            />,
                        }}
                    >视频下载格式</ListItem>
                    <ListItem
                        onClick={() => this.handleSetOption('videoPlayerWidenType')}
                        operation={<Radio on={videoPlayerWidenType.on}/>}
                        subList={{
                            hide: !videoPlayerWidenType.on,
                            theme: {twoLine: false},
                            children: <RadioButtonGroup
                                value={videoPlayerWidenType.value}
                                data={[
                                    {title: '一般宽屏', value: 'wide'},
                                    {title: '网页全屏', value: 'web'},
                                    {title: '屏幕全屏', value: 'full'},
                                ]}
                                onClick={(value) => this.handleSetOption('videoPlayerWidenType', value)}
                            />,
                        }}
                    >播放器宽屏</ListItem>
                </List>
                <List
                    title="直播区"
                >
                    <ListItem
                        onClick={() => this.handleSetOption('sign')}
                        operation={<Radio on={sign.on}/>}
                    >自动签到</ListItem>
                    <ListItem
                        onClick={() => this.handleSetOption('treasure')}
                        operation={<Radio on={treasure.on}/>}
                    >辅助领瓜子</ListItem>
                    <ListItem
                        onClick={() => this.handleSetOption('chatFilter')}
                        /*twoLine
                        first="聊天信息屏蔽设置"
                        second={`已启用：${_.map(chatFilter.value, (value, key) => (
                            value ? _.find(chatFilter.types, (e) => e.key === key).name : ''
                        )).join(' ').trim() || '无'}`}*/
                        // extend
                        operation={<Radio on={chatFilter.on}/>}
                        subList={{
                            hide: !chatFilter.on,
                            theme: {twoLine: false},
                            children: <CheckBoxGroup
                                data={chatFilter.types}
                                value={chatFilter.value}
                                onClick={(value) => this.handleSetOption('chatFilter', value)}
                            />,
                        }}
                    >聊天信息屏蔽设置</ListItem>
                </List>
                <List
                    title="关于助手"
                >
                    <ListItem
                        icon={<Icon type="cat128" image/>}
                        twoLine
                        first={chrome.i18n.getMessage('extName')}
                        second={`版本 ${version}（正式版）`}
                        separator
                        operation={<Button normal>检查更新</Button>}
                    />
                    <UpdateList
                        title='版本须知'
                        data={[
                            {title: '从0.8.16.13版本开始不再提供“区域限制解锁”和“自动抽奖”功能'},
                            {title: '从0.8.16.20版本开始不再提供“播放器切换”功能'},
                        ]}/>
                    <UpdateList
                        title='版本 0.9.9'
                        data={[
                            {type: 'serious', title: '重新修复了部分老内核版本浏览器在主站视频页面打开后不停刷请求的问题'},
                        ]}/>
                    <UpdateList
                        title='版本 0.9.7 - 0.9.8'
                        data={[
                            {title: '增加主站视频播放器右侧自动切换到弹幕列表的功能（该功能没有关闭选项）'},
                            {title: '增加自动关闭直播间弹出心愿瓶的窗口（该功能没有关闭选项）'},
                            {title: '增加直播区自动将银瓜子兑换为硬币的功能'},
                            {title: '修复了主站视频下载链接获取失败的问题'},
                            {title: '修复了主站视频播放器自动宽屏失效问题'},
                            {title: '修复了直播区瓜子宝箱无法关闭弹出窗口的问题'},
                            {title: '修复了直播区自动签到后的显示问题'},
                            {title: '修复了直播区小电视宝箱目标和去污粉重叠的问题'},
                            {title: '更新投喂表（非实时&手动更新）'},
                        ]}/>
                </List>
            </OptionBody>
            <Modal on={modalOn} title={modalTitle} body={modalBody} buttons={modalButtons}/>
        </React.Fragment>;
    }
}

$(document).ready(() => {
    ReactDOM.render(
        <PageOptions/>,
        document.getElementById('root'),
    );
});
