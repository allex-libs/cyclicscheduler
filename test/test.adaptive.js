var CyclicSchedulerFactory = require('../index.js')(execlib).CyclicSchedulerFactory;
var PerHourCyclicScheduler;

describe('Minutes in hour - Basic [Sucess]',function(){

  it('Basic',function(){
    var scheduler = CyclicSchedulerFactory.createCyclicScheduler({
      klass : CyclicSchedulerFactory.klasses.PER_HOUR,
      minutes_in_hour : [4,13,15,18,20,30,45,50,51,53,56,57,58] 
    });
    //console.log('DAJ TAJ PROTOTYPE',scheduler.getNextMilestone);
    var adaptiveScheduler = CyclicSchedulerFactory.createCyclicScheduler({
      klass : CyclicSchedulerFactory.klasses.ADAPTIVE_1,
      //time : 1518700380000
      time : scheduler.getNextMilestone().milestone.getTime()
    });
    //console.log('PRAVI MILESTONE',new Date(1518700380000))
    //console.log('PRAVI MILESTONE',scheduler.getNextMilestone().milestone);
    //console.log('DA VIDIMO ADAPTIVNI NEXTMILESTONE',adaptiveScheduler.getNextMilestone());
    adaptiveScheduler.startEmitting();
    adaptiveScheduler.emitter.attach(console.log.bind(console,'MILESTONE'));
  });

});
