function adaptiveSchedulerCreator(execlib,CyclicScheduler){  
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  function sortNumberDesc(a,b){
    return b-a;
  }

  function numberChecker(elem){
    if (!lib.isNumber(elem)){
      throw new lib.Error('DIFFERENTIAL_NOT_A_NUMBER','Differential must be a number');
    }
  }

  function AdaptiveScheduler(prophash){
    CyclicScheduler.call(this,prophash);
    this.time = prophash.time;
    if (!lib.isArray(prophash.timespanDifferentials)){
      throw new lib.Error('TIMESPAN_DIFFERENTIALS_NOT_AN_ARRAY','timespanDifferentials must be an array');
    }
    prophash.timespanDifferentials.forEach(numberChecker);
    this.timespanDifferentials = prophash.timespanDifferentials.sort(sortNumberDesc);
    this.emitter = new lib.HookCollection();
    this.emitting = false;
    //format: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
    //        15*1000, 30*1000, 60*1000, 120*1000, 300*1000, 600*1000, 900*1000, 1200*1000,
    //        1800*1000,3600*1000, 2*3600*1000, 6*3600*1000, 24*3600*1000]
    //meaning: [1sec, 2sec, 3sec, 4sec, 5sec, 6sec, 7sec, 8sec, 9sec, 10sec,
    //         15sec, 30sec, 60sec, 2min, 5min, 10min, 15min, 20min,
    //         30min, 1h, 2h, 6h, 1day]
  }

  lib.inherit(AdaptiveScheduler,CyclicScheduler);

  AdaptiveScheduler.prototype.destroy = function(){
    this.emitting = null;
    if (this.emitter){
      this.emitter.destroy();
    }
    this.emitter = null;
    this.time = null;
    this.timespanDifferentials = null;
    CyclicScheduler.prototype.destroy.call(this);
  };

  AdaptiveScheduler.prototype.setTime = function(time){
    this.time = time;
  };

  AdaptiveScheduler.prototype.startEmitting = function(){
    var nextMilestone, now;
    this.emitting = true;
    this.emit(true);
  };

  AdaptiveScheduler.prototype.emit = function(initial){
    if (!this.emitting){
      return;
    }
    nextMilestone = this.getNextMilestone();
    if (initial){
      this.emitter.fire(lib.extend({special_code : 'MORE_THAN'},nextMilestone));
    }
    //console.log('DOHVATIO MILESTONE',nextMilestone);
    now = new Date();
    lib.runNext(this.doEmit.bind(this,nextMilestone),nextMilestone.milestone.getTime() - now.getTime());
  };

  AdaptiveScheduler.prototype.doEmit = function(milestone){
    if (!this.emitter){
      return;
    }
    this.emitter.fire(milestone);
    this.emit();
  };

  AdaptiveScheduler.prototype.stopEmitting = function(){
    this.emitting = false;
  };

  AdaptiveScheduler.prototype.findFirstHigherDifferential = function(absDiff){
    for (var i=this.timespanDifferentials.length-1; i>=0; i--){
      if (absDiff < this.timespanDifferentials[i]){
        return this.timespanDifferentials[i];
      }
    }
    throw new lib.Error('DELAY_OVERFLOW','Delayed time is too high for this adaptive scheduler');
  };
  
  AdaptiveScheduler.prototype.findLastLowerDifferential = function(absDiff){
    for (var i=0; i<this.timespanDifferentials.length; i++){
      if (absDiff > this.timespanDifferentials[i]){
        return this.timespanDifferentials[i];
      }
    }
    throw new lib.Error('TOO_LOW_GRANULATION','Granulation too low. The lowest timestamp for this adaptive scheduler is ' + this.timespanDifferentials[this.timespanDifferentials.length - 1]);
  };

  AdaptiveScheduler.prototype.findNextDifferential = function(differential){
    var absDifferential = Math.abs(differential);
    var diff,ret;
    if (differential <= 1000){
      diff = this.findFirstHigherDifferential(absDifferential);
      ret = diff - absDifferential;
    }else{
      diff = this.findLastLowerDifferential(absDifferential);
      ret = absDifferential - diff;
    }
    if (ret < 1000){
      return 1000;
    }
    return ret;
  };

  AdaptiveScheduler.prototype.getNextMilestone = function(){
    var now = new Date();
    var nowMillis = now.getTime();
    var nextMillis = this.time;
    var differential = nextMillis - nowMillis;
    var nextDifferential = this.findNextDifferential(differential);
    return this.createMilestoneObjFromTimestamp(new Date(this.time),nowMillis + nextDifferential);
  };

  return AdaptiveScheduler;
}

module.exports = adaptiveSchedulerCreator;
