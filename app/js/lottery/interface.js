import $ from 'jquery';

class Interface {
    getOmit(issue) {
        let self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/get/issue',
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
                    resolve.call(self, res);
                },
                fail(err) {
                    reject.call(self, err);
                }
            });
        });
    }

}

export default Interface;