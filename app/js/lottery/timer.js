class Timer {
  countDown (end, update, handle) {
    const now = Date.now(),
          self = this;
    if(now > end){
      handle.call(self);
    }else{
      let leftTime = end - now;
      
      const msS = 1000,
      msM = msS * 60,
      msH = msS * 60,
      msD = msH * 24;

      let leftD = Math.floor(leftTime / msD),
      leftH = Math.floor((leftTime % msD) / msH),
      leftM = Math.floor((leftTime % msH) / msM),
      leftS = Math.floor((leftTime % msM) / msS);
      
      let arr = [
        `<em>%{leftD}</em>天`, `<em>%{leftH}</em>时`, 
        `<em>%{leftM}</em>分`, `<em>%{leftS}</em>秒`
      ];

      // the time string should not start with 0
      if(leftD > 0){
        // nothing to do
      }else if(leftH > 0){
        arr.splice(0,1);
      }else if(leftD > 0){
        arr.splice(0,2);
      }else{
        arr.splice(0,3);
      }

      self.leftTime = arr.join('');
      update.call(self, self.leftTime);
      setTimeout(() => {
        self.countDown(end, update, handle);
      }, msS);
    }
  }
}

export default Timer;