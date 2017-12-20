function cyclicSchedulerCreator(execlib){  
  var lib = execlib.lib;
  var MilestoneObject = require('./milestoneobject.js')(execlib);

  function CyclicScheduler(prophash){
    this.klass = prophash.klass;
  }

  CyclicScheduler.prototype.destroy = function(){
    this.klass = null;
  };

  CyclicScheduler.prototype.sortNumberAsc = function(a,b){
    return a-b;
  };

  CyclicScheduler.prototype.createMilestoneObjFromTimestamp = function(start, timestamp){
    var milestone = new Date(timestamp);
    //console.log('-- createMilestoneObjFromTimestamp',milestone);
    return new MilestoneObject({
      start: start,
      milestone: milestone
    });
  };

  CyclicScheduler.prototype.createMilestoneObj = function(start,prophash){
    var milestone;
    if (prophash.milestone){
      milestone = new Date(prophash.milestone.getTime());
    }else{
      milestone = new Date(start.getTime());
    }
    prophash.chosenMonth = parseInt(prophash.chosenMonth);
    if (Number.isInteger(prophash.chosenMonth)){
      milestone.setMonth(prophash.chosenMonth);
    }
    prophash.chosenDate = parseInt(prophash.chosenDate);
    if (Number.isInteger(prophash.chosenDate)){
      milestone.setDate(prophash.chosenDate);
    }
    prophash.chosenHour = parseInt(prophash.chosenHour);
    if (Number.isInteger(prophash.chosenHour)){
      milestone.setHours(prophash.chosenHour);
    }
    prophash.chosenMinute = parseInt(prophash.chosenMinute);
    if (Number.isInteger(prophash.chosenMinute)){
      milestone.setMinutes(prophash.chosenMinute);
    }
    milestone.setSeconds(0);
    milestone.setMilliseconds(0);
    //console.log('--> createMilestoneObj',milestone);
    return new MilestoneObject({
      start: start,
      milestone: milestone
    });
  };

  CyclicScheduler.prototype.findFirstHigherValueInArray = function(arry, value){
    if (!lib.isArray(arry)){
      throw new lib.Error('FIRST_PARAM_NOT_ARRAY','arry parameter must be an array');
    }
    var i;
    for (i=0; i<arry.length; i++){
      if (arry[i] > value){
        return arry[i];
      }
    }
    return -1;
  };

  //abstract
  CyclicScheduler.prototype.getNextMilestone = function(){
    throw new lib.Error('METHOD_NOT_IMPLEMENTED','getNextMilestone is not implemented in base class.');
  };

  return CyclicScheduler;
}

module.exports = cyclicSchedulerCreator;
