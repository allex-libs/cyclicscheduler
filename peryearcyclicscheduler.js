function perYearCyclicSchedulerCreator(execlib,CyclicScheduler){  
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  var CyclicScheduler = require('./cyclicscheduler.js')(execlib);

  function PerYearCyclicScheduler(prophash){
    CyclicScheduler.call(this,prophash);
  }

  lib.inherit(PerYearCyclicScheduler,CyclicScheduler);

  PerYearCyclicScheduler.prototype.destroy = function(){
    CyclicScheduler.prototype.destroy.call(this);
  };

  PerYearCyclicScheduler.prototype.getMillisUntilNextMilestone = function(){
  };

  return PerYearCyclicScheduler;
}

module.exports = perYearCyclicSchedulerCreator;
