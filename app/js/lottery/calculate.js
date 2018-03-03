class Calculate {
    /**
     * 计算注数
     * @param {number} selected 选择的彩票号码总数
     * @param {string} mode 玩法模式
     */
    computeCount (selected, mode){
        let count = 0;
        const exist = this.modeList.has(mode);
        if(exist && mode.at(0) === 'r'){
            count = Calculate.combine(mode.split('')[1], selected);
        }
        return count;
    }

    /**
     * 
     * @param {number} selected 选择的彩票号码总数
     * @param {number} mode 玩法模式
     */
    computeBonus (selected, mode) {
        let min = 0,
            max = 0,
            self = this;
        const ref = 5, //real真实开奖号码个数
            all = 11, //all可选号码总数
            modex = +(mode.at(1)), //mode中奖模式个数(3-8)
            comb = Calculate.combine;        
        if(mode.at(0) === 'r' && modex <= selected){
            // modex > selected时，必然不能中奖，max，min都保持为0
            if(modex <= ref){
                max = comb(modex, Math.min(ref, selected));
            }else{
                max = comb(modex-ref, selected-ref);
            }

            if(modex <= ref){
                min = comb(modex, selected - (all-ref));
            }else{
                min = (selected === all) * comb(modex-ref, all-ref);
            }
        }

        return [min, max].map((item) => {
            return item * self.modeList.get(mode).bonus;
        });
    }

    /**
     * 计算从all中取some个的组合数
     * @param {number} some 
     * @param {number} all 
     */
    static combine(some, all) {
        all = Math.max(0, all);
        some = Math.max(0, some);

        let factorial = (result, n) => {
            if(n > 1){
                return factorial(n*result, n-1);
            }else if(n === 1){
                return result;
            }else{
                return 0;
            }
        };   

        if(all >= some && some > 0){
            return all > some ?
                factorial(1, all) / factorial(1, some) / factorial(1, all - some) :
                1;
        }else{
            return 0;
        }
    }

}

export default Calculate;
