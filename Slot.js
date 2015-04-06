var Slot = (function() {
  var count = 0,check = -1, stopCount = 0,instanceNum = 0;
  var slot = function(images, imageWidth, imageHeight, x, y,id) {
    this.images = [];
    for(var i=0; i< images.length; i++){
      var img = document.createElement('img');
      img.src = images[i];img.width = imageWidth;img.height = imageHeight;
      img.style.top = y + i*imageHeight+"px";
      img.style.left = x+"px";
      var dom = document.getElementById(id);
      dom.appendChild(img);
      this.images.push(img);
    }
    this.width = imageWidth;
    this.height = imageHeight;
    this.x = x;
    this.y = y;
    this.len = (2*this.height)+this.y;
    this.reset = this.y-this.height;
    this.running = false;
    this.t = {};
    this.timers = [];
    instanceNum++;
  }

  var p = slot.prototype;

  p.start = function() {
    count = 0;check = -1, stopCount = 0;
    if(!this.running){
      this.running = true;
      //2つ作成し、ちょうど良いところで止まるようにする
      for(var i = 0; i< 2; i++){
        for(var key in this.images){
          p.move(key,this);
        }
      }
    }
  }

  p.move = function(n,slotObj) {
    var img = slotObj.images[n];
    slotObj.timers[n] = setTimeout(function() {
      img.style.top = img.offsetTop >= slotObj.len ? slotObj.reset +"px" : img.offsetTop+1+"px";
      if(!slotObj.running){
        var bounds = img.getBoundingClientRect();
        if(img.offsetTop == (slotObj.height*0)+(slotObj.y) || img.offsetTop == (slotObj.height*1)+(slotObj.y) || img.offsetTop == (slotObj.height*2)+(slotObj.y)){
          clearTimeout(slotObj.timers[n]);
          delete slotObj.t[n];
        }else{
          slotObj.move(n,slotObj);
        }
        if(Object.keys(slotObj.t).length == 0){
          slotObj.running = false;
          if(count == instanceNum)alert("成功");
          else if(stopCount == instanceNum) alert("失敗");
        }
      }else slotObj.move(n,slotObj);
    },1);
  }

  p.stop = function() {
    if(this.running){
      for (var key in this.timers){
        clearTimeout(this.timers[key]);
        var img = this.images[key];
        this.t[key] = img.offsetTop;
        this.running = false;
        if(img.offsetTop > (this.height*0)+(this.y) &&img.offsetTop < (this.height*1)+(this.y)){
          if(check < 0)check = key;
          if(check == key)count++;
        }
      }
      stopCount++;
    }
  }
  return slot;
})();