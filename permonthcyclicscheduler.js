function perMonthCyclicSchedulerCreator(execlib,CyclicScheduler){  
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  var CyclicScheduler = require('./cyclicscheduler.js')(execlib);

  function PerMonthCyclicScheduler(prophash){
    CyclicScheduler.call(this,prophash);
  }

  lib.inherit(PerMonthCyclicScheduler,CyclicScheduler);

  PerMonthCyclicScheduler.prototype.destroy = function(){
    CyclicScheduler.prototype.destroy.call(this);
  };

  PerMonthCyclicScheduler.prototype.getNextMilestone = function(){
  };

  return PerMonthCyclicScheduler;
}

module.exports = perMonthCyclicSchedulerCreator;
