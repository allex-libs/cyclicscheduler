var moment = require('moment');

function perDayCyclicSchedulerCreator(execlib,CyclicScheduler){
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  function PerDayCyclicScheduler(prophash){
    CyclicScheduler.call(this,prophash);
    this.dayManagerObj = {};
    if (!lib.isArray(prophash.times)){
      throw new lib.Error('TIMES_NOT_ARRAY','times parameter must be an array');
    }
    if (prophash.times.length === 0){
      throw new lib.Error('TIMES_ARRAY_EMPTY','times parameter must be a non-empty array');
    }
    prophash.times.forEach(this.fillMinutesForEachHour.bind(this));
    lib.traverseShallow(this.dayManagerObj,this.sortMinutesInHour.bind(this));
  }

  lib.inherit(PerDayCyclicScheduler,CyclicScheduler);

  PerDayCyclicScheduler.prototype.destroy = function(){
    this.dayManagerObj = null;
    CyclicScheduler.prototype.destroy.call(this);
  };

  PerDayCyclicScheduler.prototype.sortMinutesInHour = function(minutesInHour){
    minutesInHour = minutesInHour.sort(this.sortNumberAsc);
  }

  PerDayCyclicScheduler.prototype.fillMinutesForEachHour = function(timeObj){
    if (timeObj === null || 'object' !== typeof timeObj){
      throw new lib.Error('TIMES_ARRAY_ELEMENT_NOT_OBJECT','times array element must be an object');
    }
    if (!Number.isInteger(timeObj.hour) || !Number.isInteger(timeObj.minute)){
      throw new lib.Error('HOUR_OR_MINUTE_NOT_INTEGER','times array element must have hour and minute as integer properties');
    }
    if (timeObj.hour < 0 || timeObj.hour > 23){
      throw new lib.Error('INVALID_HOUR','hour must be in range 0-23');
    }
    if (timeObj.minute < 0 || timeObj.minute > 59){
      throw new lib.Error('INVALID_MINUTE','minute must be in range 0-59');
    }
    if (!this.dayManagerObj[timeObj.hour]){
      this.dayManagerObj[timeObj.hour] = [timeObj.minute];
    }else{
      this.dayManagerObj[timeObj.hour].push(timeObj.minute);
    }
  };

  PerDayCyclicScheduler.prototype.getNextMilestone = function(){
    var now = new Date(), next;
    var chosenHour = -1, chosenMinute = -1;
    var currHour = now.getHours(), currMinute = now.getMinutes();
    var minutes, hours;
    var fhMinute, fhHour;
    var i;
    //first check if there are minutes for current hour
    minutes = this.dayManagerObj[currHour];
    if (minutes){
      //if there are, try find the first higher than current
      fhMinute = this.findFirstHigherValueInArray(minutes,currMinute);
      if (fhMinute !== -1){
        return this.createMilestoneObj(now,{
          //chosenHour : currHour, //no need to set hour because it's current hour
          chosenMinute : fhMinute 
        });
      }
    }
    hours = Object.keys(this.dayManagerObj).map(function(item){return parseInt(item,10)}).sort(this.sortNumberAsc);
    //if there isn't, try finding first higher hour
    fhHour = this.findFirstHigherValueInArray(hours,currHour);
    if (fhHour !== -1){
      return this.createMilestoneObj(now,{
        chosenHour : fhHour,
        chosenMinute : this.dayManagerObj[fhHour][0]
      });
    }
    //at last take earliest hour/minute of next day
    chosenHour = hours[0];
    chosenMinute = this.dayManagerObj[chosenHour][0];
    next = moment().add(1,'d');
    next = next.toDate();
    return this.createMilestoneObj(now,{
      milestone : next,
      chosenHour : chosenHour,
      chosenMinute : chosenMinute
    });
  };

  return PerDayCyclicScheduler;
}

module.exports = perDayCyclicSchedulerCreator;
