import 'babel-polyfill';
import Base from './lottery/base.js';
import Timer from './lottery/timer.js';
import Calculate from './lottery/calculate.js';
import Interface from './lottery/interface.js';
import $ from 'jquery';

const copyProperties = function(target, src){
    for(let key of Reflect.ownKeys(src)){
        if(key !== 'prototype' && 
        key !== 'constructor' && 
        key !== 'name'){
            let desc = Object.getOwnPropertyDescriptor(src,key);
            Object.defineProperty(target, key, desc);
        }
    }
}

const mix = function(...mixins){
    class Mix{}
    for(let mixin of mixins){
        copyProperties(Mix, mixin);
        copyProperties(Mix.prototype, mixin.prototype);
    }
    return Mix;
}

class Lottery extends mix(Base, Calculate, Interface, Timer){
    constructor(name = 'syy', cname = '11选5', issue = '**', state = '**' ){
        super();
        this.name = name;
        this.cname = cname;
        this.issue = issue;
        this.ele = '';
        this.omit = new Map();
        this.openCode = new Set();
        this.openCodeList = new Set();
        this.modeList = new Map();
        this.number = new Set();
        this.issueEle = '#curr_issue';
        this.countDownEle = '#countdown';
        this.stateEle = '.state_el';
        this.cartEle = '.codelist';
        this.omitEle = '';
        this.curMode = 'r5';
        this.initModeList();
        this.initNumber();
        this.updateState();
        this.initEvent();
    }

    updateState(){
        let self = this;
        this.getState().then(function(res){
            self.issue = res.issue;
            self.endTime = res.end_time;
            self.state = res.state;
            $(self.issueEle).text(res.issue);
            self.countDown(res.end_time, function(time){
                $(self.countDownEle).html(time);
            },function(){
                setTimeout(() => {
                    self.updateState();
                    self.getOmit(self.issue).then(function(res){
                        console.log('data in getOmit:', res);
                    }).catch(function(err){
                        console.log('error in getOmit:\n ', err);
                    });
                    self.getOpenCode(self.issue).then(function(res){
                        console.log('data in getOpenCode: ', res);
                    }).catch(function(err){
                        console.log('error in getOpenCode:\n', err);
                    });
                }, 500);
            });
        });
    }

    /** 
     * 绑定事件
    */
    initEvent(){
        let self = this;
        $('#plays').on('click', 'li', self.changeModeNav.bind(self));
        $('.boll-list').on('click','.btn-boll', self.toggleCodeSelected.bind(self));
        $('#confirm_sel_code').on('click', self.addCode.bind(self));
        $('.dxjo').on('click','li',self.assistSelect.bind(self));
        $('.qkmethod').on('click','.btn-middle',self.getRandomCode.bind(self));
    }    

}

export default Lottery;