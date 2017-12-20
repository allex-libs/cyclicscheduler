var CyclicSchedulerFactory = require('../index.js')(execlib).CyclicSchedulerFactory;

function getMilestoneFromPerWeek(times){
  var PerWeekCyclicScheduler = CyclicSchedulerFactory.createCyclicScheduler({
    klass : CyclicSchedulerFactory.klasses.PER_WEEK,
    times : times 
  });
  return PerWeekCyclicScheduler.getMillisUntilNextMilestone();
};

describe('Basic [Sucess]',function(){

  it('Standard use-case: Sunday 9:15, Monday 23:10, Monday 23:25, Monday 13:10, Wednesday 20:55, Saturday 20:45',function(){
    var times = [{
      day : 0, //integer 0-6
      hour : 9, //integer 0-23
      minute : 15 //integer 0-59
    },{
      day : 1,
      hour : 23, 
      minute : 10
    },{
      day : 1,
      hour : 23, 
      minute : 25
    },{
      day : 1,
      hour : 13, 
      minute : 10
    },{
      day : 3,
      hour : 20,
      minute : 55
    },{
      day : 6,
      hour : 20, 
      minute : 45 
    }];
    var milestoneObj = getMilestoneFromPerWeek(times);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
  });

  it('Standard use-case: Sunday 9:15, Wednesday 23:10, Wednesday 10:25, Wednesday 13:10, Wednesday 14:55, Wednesday 15:50',function(){
    var times = [{
      day : 0, //integer 0-6
      hour : 9, //integer 0-23
      minute : 15 //integer 0-59
    },{
      day : 3,
      hour : 23, 
      minute : 10
    },{
      day : 3,
      hour : 10, 
      minute : 25
    },{
      day : 3,
      hour : 13, 
      minute : 10
    },{
      day : 3,
      hour : 14,
      minute : 55
    },{
      day : 3,
      hour : 15, 
      minute : 50
    }];
    var milestoneObj = getMilestoneFromPerWeek(times);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
  });

  it('Standard use-case: Monday 9:15, Monday 9:07, Monday 10:10, Tuesday 8:25',function(){
    var times = [{
      day : 1, //integer 0-6
      hour : 9, //integer 0-23
      minute : 15 //integer 0-59
    },{
      day : 1,
      hour : 9, 
      minute : 7
    },{
      day : 1,
      hour : 9, 
      minute : 0
    },{
      day : 1,
      hour : 10, 
      minute : 10
    },{
      day : 2,
      hour : 8, 
      minute : 25
    }];
    var milestoneObj = getMilestoneFromPerWeek(times);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
  });

  it('Standard use-case: Wednesday 14:03, Wednesday 14:08, Wednesday 14:12, Wednesday 14:32,',function(){
    var times = [{
      day : 3, //integer 0-6
      hour : 14, //integer 0-23
      minute : 3 //integer 0-59
    },{
      day : 3,
      hour : 14, 
      minute : 8
    },{
      day : 3,
      hour : 14, 
      minute : 12
    },{
      day : 3,
      hour : 14, 
      minute : 32
    }];
    var milestoneObj = getMilestoneFromPerWeek(times);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
  });
});

describe('Basic [Fail]',function(){

});
