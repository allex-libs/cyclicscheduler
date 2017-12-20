var CyclicSchedulerFactory = require('../index.js')(execlib).CyclicSchedulerFactory;

function getMilestoneFromTicksPerHour(ticks_per_hour){
  var PerHourCyclicScheduler = CyclicSchedulerFactory.createCyclicScheduler({
    klass : CyclicSchedulerFactory.klasses.PER_HOUR,
    ticks_per_hour : ticks_per_hour
  });
  var ret = PerHourCyclicScheduler.getMillisUntilNextMilestone();
  PerHourCyclicScheduler.destroy();
  return ret;
};

function getMilestoneFromMinutesInHour(minutes_in_hour){
  var PerHourCyclicScheduler = CyclicSchedulerFactory.createCyclicScheduler({
    klass : CyclicSchedulerFactory.klasses.PER_HOUR,
    minutes_in_hour : minutes_in_hour
  });
  var ret = PerHourCyclicScheduler.getMillisUntilNextMilestone();
  PerHourCyclicScheduler.destroy();
  return ret;
};

describe('Ticks per hour - Basic [Sucess]',function(){

  it('1 ticks per hour',function(){
    var ticks_per_hour = 1;
    var milestoneObj = getMilestoneFromTicksPerHour(ticks_per_hour);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
    expect(milestoneObj.start.getTime()).to.be.above(milestoneObj.milestone.getTime() - (60/ticks_per_hour) * 60 * 1000);
  });

  it('2 ticks per hour',function(){
    var ticks_per_hour = 2;
    var milestoneObj = getMilestoneFromTicksPerHour(ticks_per_hour);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
    expect(milestoneObj.start.getTime()).to.be.above(milestoneObj.milestone.getTime() - (60/ticks_per_hour) * 60 * 1000);
  });

  it('5 ticks per hour',function(){
    var ticks_per_hour = 5;
    var milestoneObj = getMilestoneFromTicksPerHour(ticks_per_hour);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
    expect(milestoneObj.start.getTime()).to.be.above(milestoneObj.milestone.getTime() - (60/ticks_per_hour) * 60 * 1000);
  });

  it('10 ticks per hour',function(){
    var ticks_per_hour = 10;
    var milestoneObj = getMilestoneFromTicksPerHour(ticks_per_hour);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
    expect(milestoneObj.start.getTime()).to.be.above(milestoneObj.milestone.getTime() - (60/ticks_per_hour) * 60 * 1000);
  });

  it('30 ticks per hour',function(){
    var ticks_per_hour = 30;
    var milestoneObj = getMilestoneFromTicksPerHour(ticks_per_hour);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
    expect(milestoneObj.start.getTime()).to.be.above(milestoneObj.milestone.getTime() - (60/ticks_per_hour) * 60 * 1000);
  });

  it('60 ticks per hour',function(){
    var ticks_per_hour = 60;
    var milestoneObj = getMilestoneFromTicksPerHour(ticks_per_hour);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
    expect(milestoneObj.start.getTime()).to.be.above(milestoneObj.milestone.getTime() - (60/ticks_per_hour) * 60 * 1000);
  });

});

describe('Minutes in hour - Basic [Sucess]',function(){

  it('[15,30,45]',function(){
    var milestoneObj = getMilestoneFromMinutesInHour([15,30,45]);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
  });

  it('[5,10,15,25,30]',function(){
    var milestoneObj = getMilestoneFromMinutesInHour([5,10,15,25,30]);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
  });

  it('[0]',function(){
    var milestoneObj = getMilestoneFromMinutesInHour([0]);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
  });

});

describe('Minutes in hour - Basic [Fail]',function(){

  it('No minutes_in_hour',function(){
    expect(function(){getMilestoneFromMinutesInHour(null)}).to.throw(/could not be specified from prophash/);
  });

  it('Non-array',function(){
    expect(function(){getMilestoneFromMinutesInHour({})}).to.throw(/must be an array/);
  });

  it('Empty array',function(){
    expect(function(){getMilestoneFromMinutesInHour([])}).to.throw(/must be non-empty array/);
  });

  it('Non-integer elements',function(){
    expect(function(){getMilestoneFromMinutesInHour([2,3,false,{}])}).to.throw(/must be an integer/);
  });

  it('Non-minute elements',function(){
    expect(function(){getMilestoneFromMinutesInHour([3,10,15,150,2000])}).to.throw(/must be in range 0-59/);
  });

});
