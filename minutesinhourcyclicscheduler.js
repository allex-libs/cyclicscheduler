var moment = require('moment');

function minutesInHourCyclicSchedulerCreator(execlib,PerHourCyclicScheduler){  
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  function minuteChecker(minute){
    if (!Number.isInteger(minute)){
      throw new lib.Error('MINUTES_IN_HOUR_NOT_INT','array element must be an integer');
    }
    if (minute < 0 || minute > 59){
      throw new lib.Error('MINUTES_IN_HOUR_NOT_ALLOWED','array element must be in range 0-59');
    }
  };

  function MinutesInHourCyclicScheduler(prophash){
    PerHourCyclicScheduler.call(this,prophash);
    if (!lib.isArray(prophash.minutes_in_hour)){
      throw new lib.Error('MINUTES_IN_HOUR_NOT_ARRAY','minutes_in_hour parameter must be an array');
    }
    if (prophash.minutes_in_hour.length === 0){
      throw new lib.Error('MINUTES_IN_HOUR_EMPTY_ARRAY','minutes_in_hour must be non-empty array');
    }
    prophash.minutes_in_hour.forEach(minuteChecker.bind(null));
    this.minutes_in_hour = prophash.minutes_in_hour.sort(this.sortNumberAsc);
  }

  lib.inherit(MinutesInHourCyclicScheduler,PerHourCyclicScheduler);

  MinutesInHourCyclicScheduler.prototype.destroy = function(){
    this.minutes_in_hour = null;
    PerHourCyclicScheduler.prototype.destroy.call(this);
  };

  MinutesInHourCyclicScheduler.prototype.getMillisUntilNextMilestone = function(){
    var now = new Date();
    var currMinutes = now.getMinutes();
    var chosenMinute = -1;
    var milestone;
    for (var i=0; i<this.minutes_in_hour.length; i++){
      if (this.minutes_in_hour[i] > currMinutes){
        chosenMinute = this.minutes_in_hour[i];
        break;
      }
    }
    if (chosenMinute === -1){
      milestone = moment().add(1,'h');
      milestone = milestone.toDate();
      return this.createMilestoneObj(now,{
        milestone : milestone,
        chosenMinute : this.minutes_in_hour[0]
      })
    }else{
      return this.createMilestoneObj(now,{
        milestone : milestone,
        chosenMinute : chosenMinute 
      })
    }
  };

  return MinutesInHourCyclicScheduler;
}

module.exports = minutesInHourCyclicSchedulerCreator;
