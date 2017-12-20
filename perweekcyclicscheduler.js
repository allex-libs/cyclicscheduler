var moment = require('moment');

function perWeekCyclicSchedulerCreator(execlib,CyclicScheduler){  
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  var CyclicScheduler = require('./cyclicscheduler.js')(execlib);

  function PerWeekCyclicScheduler(prophash){
    CyclicScheduler.call(this,prophash);
    this.weekManagerObj = {};
    if (!lib.isArray(prophash.times)){
      throw new lib.Error('TIMES_NOT_ARRAY','times parameter must be an array');
    }
    if (prophash.times.length === 0){
      throw new lib.Error('TIMES_ARRAY_EMPTY','times parameter must be a non-empty array');
    }
    prophash.times.forEach(this.fillHoursForEachDay.bind(this));
    lib.traverseShallow(this.weekManagerObj,this.traverseHoursInDay.bind(this));
  }

  lib.inherit(PerWeekCyclicScheduler,CyclicScheduler);

  PerWeekCyclicScheduler.prototype.destroy = function(){
    CyclicScheduler.prototype.destroy.call(this);
  };

  PerWeekCyclicScheduler.prototype.sortMinutesInHour = function(minutesInHour){
    minutesInHour = minutesInHour.sort(this.sortNumberAsc);
  }

  PerWeekCyclicScheduler.prototype.traverseHoursInDay = function(hoursInDayObj){
    lib.traverseShallow(hoursInDayObj,this.sortMinutesInHour.bind(this));
  };

  PerWeekCyclicScheduler.prototype.fillHoursForEachDay = function(timeObj){
    if (timeObj === null || 'object' !== typeof timeObj){
      throw new lib.Error('TIMES_ARRAY_ELEMENT_NOT_OBJECT','times array element must be an object');
    }
    if (!Number.isInteger(timeObj.day) || !Number.isInteger(timeObj.hour) || !Number.isInteger(timeObj.minute)){
      throw new lib.Error('DAY_OR_HOUR_OR_MINUTE_NOT_INTEGER','times array element must have day, hour and minute as integer properties');
    }
    if (timeObj.day < 0 || timeObj.day > 6){
      throw new lib.Error('INVALID_DAY','day must be in range 0-6');
    }
    if (timeObj.hour < 0 || timeObj.hour > 23){
      throw new lib.Error('INVALID_HOUR','hour must be in range 0-23');
    }
    if (timeObj.minute < 0 || timeObj.minute > 59){
      throw new lib.Error('INVALID_MINUTE','minute must be in range 0-59');
    }
    if (!this.weekManagerObj[timeObj.day]){
      this.weekManagerObj[timeObj.day] = {};
    }
    if (!this.weekManagerObj[timeObj.day][timeObj.hour]){
      this.weekManagerObj[timeObj.day][timeObj.hour] = [timeObj.minute];
    }else{
      this.weekManagerObj[timeObj.day][timeObj.hour].push(timeObj.minute);
    }
  };

  PerWeekCyclicScheduler.prototype.getNextMilestone = function(){
    var now = new Date(), next;
    var chosenDay = -1, chosenHour = -1, chosenMinute = -1;
    var currDate = now.getDate(), currDay = now.getDay(), currHour = now.getHours(), currMinute = now.getMinutes();
    var minutes, hoursObj, hours, days;
    var fhMinute, fhHour, fhDay;
    var i;
    //first check if there are hours for current day
    hoursObj = this.weekManagerObj[currDay];
    if (hoursObj){
      //if there are, check if there are minutes for current hour
      minutes = this.weekManagerObj[currDay][currHour];
      if (minutes){
        //if there are, try find the first higher than current minute
        fhMinute = this.findFirstHigherValueInArray(minutes,currMinute);
        if (fhMinute !== -1){
          return this.createMilestoneObj(now,{
            chosenMinute : fhMinute 
          });
        }
      }
      hours = Object.keys(hoursObj).map(function(item){return parseInt(item,10)}).sort(this.sortNumberAsc);
      //if there aren't, try to find first higher hour than current
      fhHour = this.findFirstHigherValueInArray(hours,currHour);
      if (fhHour !== -1){
        return this.createMilestoneObj(now,{
          chosenHour : fhHour,
          chosenMinute : hoursObj[fhHour][0]
        });
      }
    }
    //if there are no hours for current day, find next day in cyclic order
    days = Object.keys(this.weekManagerObj).map(function(item){return parseInt(item,10)}).sort(this.sortNumberAsc);
    fhDay = this.findFirstHigherValueInArray(days,currDay);
    if (fhDay !== -1){
      //if there is a higher day, pick the earliest hour and minute from it
      next = moment().add(fhDay-currDay,'d');
      next = next.toDate();
      hours = Object.keys(this.weekManagerObj[fhDay]).map(function(item){return parseInt(item,10)}).sort(this.sortNumberAsc);
      return this.createMilestoneObj(now,{
        milestone : next,
        chosenHour : hours[0],
        chosenMinute : this.weekManagerObj[fhDay][hours[0]]
      });
    }
    //if there is no higher day, pick the earliest day from next week
    fhDay = days[0];
    next = moment().add(7 - currDay + fhDay,'d');
    next = next.toDate();
    hours = Object.keys(this.weekManagerObj[fhDay]).map(function(item){return parseInt(item,10)}).sort(this.sortNumberAsc);
    return this.createMilestoneObj(now,{
      milestone : next,
      chosenHour : hours[0],
      chosenMinute : this.weekManagerObj[fhDay][hours[0]]
    });
  };

  return PerWeekCyclicScheduler;
}

module.exports = perWeekCyclicSchedulerCreator;
