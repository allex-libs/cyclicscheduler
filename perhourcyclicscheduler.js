function perHourCyclicSchedulerCreator(execlib,CyclicScheduler){  
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  var TicksPerHourCyclicScheduler, MinutesInHourCyclicScheduler;

  function PerHourCyclicScheduler(prophash){
    CyclicScheduler.call(this,prophash);
  }

  lib.inherit(PerHourCyclicScheduler,CyclicScheduler);

  PerHourCyclicScheduler.prototype.destroy = function(){
    CyclicScheduler.prototype.destroy.call(this);
  };

  PerHourCyclicScheduler.createPerHourScheduler = function(prophash){
    if (!!prophash.ticks_per_hour){
      return new TicksPerHourCyclicScheduler(prophash);
    }
    if (!!prophash.minutes_in_hour){
      return new MinutesInHourCyclicScheduler(prophash);
    }
    throw new lib.Error('CANNOT_SPECIFY_PER_HOUR_CYCLIC_SCHEDULER','PerHourCyclicScheduler could not be specified from prophash');
  };

  TicksPerHourCyclicScheduler = require('./ticksperhourcyclicscheduler.js')(execlib,PerHourCyclicScheduler);
  MinutesInHourCyclicScheduler = require('./minutesinhourcyclicscheduler.js')(execlib,PerHourCyclicScheduler);

  return PerHourCyclicScheduler;
}

module.exports = perHourCyclicSchedulerCreator;
