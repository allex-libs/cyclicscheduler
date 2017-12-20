function createMilestoneObject(execlib){

  function MilestoneObject(prophash){
    if (!(prophash.start instanceof Date && prophash.milestone instanceof Date)){
      throw new lib.Error('INVALID_DATE','start or milestone parameter must be Date type.');
    }
    this.start = prophash.start;
    this.milestone = prophash.milestone;
    this.timespan = this.milestone.getTime() - this.start.getTime();
  }

  MilestoneObject.prototype.destroy = function(){
    this.timespan = null;
    this.milestone = null;
    this.start = null;
  };

  return MilestoneObject;

}

module.exports = createMilestoneObject;
