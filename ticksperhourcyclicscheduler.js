function ticksPerHourCyclicSchedulerCreator(execlib,PerHourCyclicScheduler){  
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  function TicksPerHourCyclicScheduler(prophash){
    PerHourCyclicScheduler.call(this,prophash);
    if (!prophash.ticks_per_hour){
      throw new lib.Error('NO_TICKS_PER_HOUR','ticks_per_hour is obligatory parameter');
    }
    if (prophash.ticks_per_hour < 1){
      throw new lib.Error('TICKS_NOT_ALLOWED','60/Ticks must be an integer. For example 12 is allowed because 60/12 === 5, but 13 is not because it is not an integer.');
    }
    if (!Number.isInteger(60 / prophash.ticks_per_hour)){
      throw new lib.Error('TICKS_NOT_ALLOWED','60/Ticks must be an integer. For example 12 is allowed because 60/12 === 5, but 13 is not because it is not an integer.');
    }
    this.ticks_per_hour = prophash.ticks_per_hour;
    this.millisecond_span = (60/prophash.ticks_per_hour) * 60 * 1000;
  }

  lib.inherit(TicksPerHourCyclicScheduler,PerHourCyclicScheduler);

  TicksPerHourCyclicScheduler.prototype.destroy = function(){
    this.millisecond_span = null;
    this.ticks_per_hour = null;
    PerHourCyclicScheduler.prototype.destroy.call(this);
  };

  TicksPerHourCyclicScheduler.prototype.getMillisUntilNextMilestone = function(){
    var now = new Date();
    var nowMillis = now.getTime();
    var next = now.getTime() + this.millisecond_span;
    var milestoneMillis = next - (next % this.millisecond_span);
    return this.createMilestoneObjFromTimestamp(now,milestoneMillis);
  };

  return TicksPerHourCyclicScheduler;
}

module.exports = ticksPerHourCyclicSchedulerCreator;
