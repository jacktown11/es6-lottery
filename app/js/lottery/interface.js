import $ from 'jquery';

class Interface {

    /**
     * 获取往期遗漏号码数据
     * @param {彩票期号} issue 
     */
    getOmit(issue) {
        let self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/get/omit',
                data: {
                    issue
                },
                dataType: 'json',
                success(res) {
                    self.setOmit(res.data);
                    resolve.call(self, res);
                },
                fail(err) {
                    reject.call(self, err);
                }
            });
        });
    }

    /**
     * 获取开奖号码
     * @param {彩票期号} issue 
     */
    getOpenCode(issue) {
        let self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/get/opencode',
                data: {
                    issue
                },
                dataType: 'json',
                success(res) {
                    self.setOpenCode(res.data);
                    resolve.call(self, res);
                },
                fail(err) {
                    reject.call(self, err);
                }
            });
        });
    }
    /**
     * 
     * @param {number} issue  彩票期号
     */
    getState(issue) {
        let self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/get/state',
                data: {
                    issue
                },
                dataType: 'json',
                success(res) {
                    console.log('data in getState:', res);
                    resolve.call(self, res);
                },
                fail(err) {
                    reject.call(self, err);
                }
            });
        }).catch(function(error){
            console.log('error in getState: \n', error);
        });
    }

}

export default Interface;