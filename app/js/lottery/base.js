import $ from 'jquery';

class Base{
    
    /**
     * 初始化奖金和玩法(Map类型)
     */
    initModeList(){
        this.modeList
            .set('r2', {
                bonus: 6,
                tip: '从01~11中任选2个或多个号码，所选号码与开奖号码任意两个号码相同，即中奖<em class="red">6</em>元',
                name: '任二'
            })
            .set('r3', {
                bonus: 19,
                tip: '从01~11中任选3个或多个号码，所选号码与开奖号码任意三个号码相同，即中奖<em class="red">19</em>元',
                name: '任三'
            })
            .set('r4', {
                bonus: 78,
                tip: '从01~11中任选4个或多个号码，所选号码与开奖号码任意四个号码相同，即中奖<em class="red">78</em>元',
                name: '任四'
            })
            .set('r5', {
                bonus: 540,
                tip: '从01~11中任选5个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">540</em>元',
                name: '任五'
            })
            .set('r6', {
                bonus: 90,
                tip: '从01~11中任选6个或多个号码，某6个所选号码包含5个开奖号码，即中奖<em class="red">6</em>元',
                name: '任六'
            })
            .set('r7', {
                bonus: 26,
                tip: '从01~11中任选7个或多个号码，某7个所选号码包含5个开奖号码，即中奖<em class="red">26</em>元',
                name: '任七'
            })
            .set('r8', {
                bonus: 9,
                tip: '从01~11中任选8个或多个号码，某8个所选号码包含5个开奖号码，即中奖<em class="red">9</em>元',
                name: '任八'
            });
    }

    /**
     * 初始化备选号码(Set类型)
     */
    initNumber(){
        for(let i = 0; i < 12; i++){
            this.number.add((''+i).padStart(2, '0'));
        }
    }

    /**
     * 设置往期开奖遗漏号码数据
     * @param {Map} omit 往期开奖遗漏号码数据 
     */
    setOmit(omit){
        let self = this;
        // 保存数据
        self.omit.clear();
        for(let [index, item] of omit.entries()){
            self.omit.set(index, item);
        }

        // 渲染数据
        $(self.omitEle).each(function(index, item){
            $(item).text(self.omit.get(index));
        });
    }

    /**
     * 设置开奖号码
     * @param {Set} code 开奖号码 
     */
    setOpenCode(code){
        let self = this;
        // 保存数据
        self.openCode.clear();
        for(let item of code.values()){
            self.openCode.add(item);
        }
        
        // 渲染数据
        self.updateOpenCode && self.updateOpenCode.call(self, self.code); 
    }
    
    /**
     * 号码选中与取消切换
     * @param {Object} event 号码点击事件
     */
    toggleCodeSelected(event){
        let self = this;
        let $cur = $(event.currentTarget);
        $cur.toggleClass('btn-boll-active');
        self.getCount();
    }

    /**
     * 切换玩法
     * 高亮显示、保存当前玩法，清空备选号码选中状态，重新计算金额, 清空选号列表
     * @param {Object} event 玩法按钮点击事件
     */
    changeModeNav(event){
        let self = this;
        let $cur = $(event.currentTarget);
        $cur.addClass('active').siblings().removeClass('active');
        self.curMode = $cur.attr('desc').toLocaleLowerCase();
        $('#zx_sm span').html(self.modeList.get(self.curMode).tip);
        $('.boll-list .btn-boll').removeClass('btn-boll-active');
        $(self.cartEle).html('');
        self.getCount();
    }

    /**
     * 号码选取辅助按钮点击时的处理函数
     * @param {Object} event 辅助选取按钮点击事件  
     */
    assistSelect(event){
        event.preventDefault();
        const self = this,
            $cur = $(event.currentTarget),
            index = $cur.index(),
            $bolls = $('.boll-list .btn-boll'),
            actCls = 'btn-boll-active';
        $bolls.removeClass('btn-boll-active');
        switch(index){
            case 0:
                $bolls.addClass(actCls);
                break;
            case 1:
                $bolls.each(function(index, item){
                    if(item.textContent - 5 > 0){
                        $(item).addClass(actCls);
                    }
                });
                break;
            case 2:
                $bolls.each(function(index, item){
                    if(item.textContent - 6 < 0){
                        $(item).addClass(actCls);
                    }
                });
                break;
            case 3:
                $bolls.each(function(index, item) {
                    if(item.textContent % 2 === 1){
                        $(item).addClass(actCls);
                    }
                });
                break;
            case 4:
                $bolls.each(function(index,item){
                    if(item.textContent % 2 === 0){
                        $(item).addClass(actCls);
                    }
                });
                break;
            default: 
                break;
        }
        self.getCount();
    }

    /**
     * 获取当前彩票名称
     */
    getName(){
        return this.name;
    }

    /**
     * 添加选号
     */
    addCode(){
        let self = this;
        let $active = $('.boll-list .btn-boll-active').text().match(/\d{2}/g);
        let active = $active? $active.length: 0;
        let count = self.computeCount(active, self.curMode);
        if(count > 0){
            self.addCodeItem($active.join(' '), self.curMode, self.modeList.get(self.curMode).name, count);
        }
    }
    /**
     * 添加一次选号(具体实现)
     * @param {string} code 选择的号码
     * @param {string} mode 玩法模式
     * @param {string} modeName 玩法模式名称
     * @param {number} count 注数
     */
    addCodeItem(code, mode, modeName, count){
        let self = this;
        const tpl = `
            <li codes="${mode} | ${code}" bonus="${count * 2}" count="${count}">
                <div class="code">
                    <b>${modeName}${count>1?'复式':'单式'}</b>
                    <b class="em">${code}</b>
                    [${count}注,<em class="code-list-money">${count * 2}</em>元]
                </div>
            </li>
        `;
        $(self.cartEle).append(tpl);
        self.getTotal();
    }

    /**
     * 根据当前选号预测中奖可能性并渲染到页面
     */
    getCount(){
        let self = this,
            active = $('.boll-list .btn-boll-active').length,
            count = self.computeCount(active, self.curMode),
            range = self.computeBonus(active, self.curMode),
            money = count * 2,
            win1 = range[0] - money,
            win2 = range[1] - money;
        let tpl,
            c1 = (win1<0 && win2<0)? Math.abs(win1): win1,
            c2 = (win1<0 && win2<0)? Math.abs(win2): win2;
        if(count === 0){
            tpl = `您选了 <b class="red">${count}</b> 注, 共<b class="red">${count * 2}</b> 元`;
        }else if(range[0] === range[1]){
            tpl = `您选了 <b>${count}</b> 注, 共 <b>${count * 2}</b> 元, <em>若中奖, 奖金: <strong class="red">${range[0]}</strong> 元, 您将${win1 >=0?'盈利':'亏损'} <strong class="${win1>=0?'red':'green'}">${Math.abs(win1)}</strong> 元</em>`
        }else{
            tpl = `您选了 <b>${count}</b> 注, 共 <b>${count * 2}</b> 元, <em>若中奖, 奖金: <strong class="red">${range[0]}</strong> 至 <strong class="red">${range[1]}</strong> 元, 您将${win1<0&&win2<0 ? '亏损' : '盈利'} <strong class="${win1 >= 0 ? 'red' : 'green'}">${c1}</strong> 至 <strong class="${win2 >= 0 ? 'red' : 'green'}">${c2}</strong> 元</em>`
        }

        $('.sel_info').html(tpl);
    }

    /**
     * 计算所有投注的总金额
     */
    getTotal(){
        let count = 0;
        $('.codelist li').each(function(index, item){
            count += $(item).attr('count') * 1;
        });
        $('#count').text(count);
        $('#money').text(count * 2); 
    }

    /**
     * 生成随机数
     * @param {number} num 获取的号码个数
     */
    getRandom(num){
        let arr = [], index;
        let number = Array.from(this.number);
        while(num--){
            index = Number.parseInt(Math.random() * number.length);
            arr.push(number[index]);
            number.splice(index, 1);
        }
        return arr.join(' ');
    }

    /**
     * 响应点击，添加随机选号或清空选号列表 
     * @param {object} event 机选/清空按钮点击事件 
     */
    getRandomCode(event){
        event.preventDefault();
        let num = event.currentTarget.getAttribute('count'),
            mode = this.curMode.match(/\d+/g)[0],
            self = this;
        if(num === '0'){
            $(self.cartEle).html('');
        }else{
            for(let i = 0;i < num; i++){
                self.addCodeItem(self.getRandom(mode), self.curMode, self.modeList.get(self.curMode).name, 1);
            }
        }
    }

}

export default Base;