var CyclicSchedulerFactory = require('../index.js')(execlib).CyclicSchedulerFactory;

function getMilestoneFromPerDay(times){
  var PerDayCyclicScheduler = CyclicSchedulerFactory.createCyclicScheduler({
    klass : CyclicSchedulerFactory.klasses.PER_DAY,
    times : times 
  });
  return PerDayCyclicScheduler.getMillisUntilNextMilestone();
};

describe('Basic [Sucess]',function(){

  it('Standard use-case: 9:15, 23:10, 20:55, 20:45',function(){
    var times = [{
      hour : 9, //integer 0-23
      minute : 15 //integer 0-59
    },{
      hour : 23, 
      minute : 10
    },{
      hour : 20,
      minute : 55
    },{
      hour : 20, 
      minute : 45 
    }];
    var milestoneObj = getMilestoneFromPerDay(times);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
  });

  it('Standard use-case: 9:15, 15:20, 15:46, 15:55, 16:20, 16:46, 16:55',function(){
    var times = [{
      hour : 9, //integer 0-23
      minute : 15 //integer 0-59
    },{
      hour : 15,
      minute : 20
    },{
      hour : 15,
      minute : 46
    },{
      hour : 15, 
      minute : 55
    },{
      hour : 16,
      minute : 20
    },{
      hour : 16,
      minute : 46
    },{
      hour : 16, 
      minute : 55
    }];
    var milestoneObj = getMilestoneFromPerDay(times);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
  });

  it('Standard use-case: 9:15, 10:20, 10:46, 10:55, 11:20, 11:46, 11:55',function(){
    var times = [{
      hour : 9, //integer 0-23
      minute : 15 //integer 0-59
    },{
      hour : 10,
      minute : 20
    },{
      hour : 10,
      minute : 46
    },{
      hour : 10, 
      minute : 55
    },{
      hour : 11,
      minute : 20
    },{
      hour : 11,
      minute : 46
    },{
      hour : 11, 
      minute : 55
    }];
    var milestoneObj = getMilestoneFromPerDay(times);
    expect(milestoneObj.start.getTime()).to.be.below(milestoneObj.milestone.getTime());
  });
});

describe('Basic [Fail]',function(){

});
