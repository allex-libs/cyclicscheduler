var CyclicSchedulerFactory = require('../index.js')(execlib).CyclicSchedulerFactory;

function instantiateCyclicScheduler(schedulers,klass){
  return schedulers.push(CyclicSchedulerFactory.createCyclicScheduler({
    klass : klass
  }));
}

function checkSchedulerObject(klasses,scheduler,index){
  expect(klasses[index]).to.be.equal(scheduler.klass);
  switch (klasses[index]){
    case CyclicSchedulerFactory.klasses.PER_HOUR:
      expect(scheduler.constructor.name).to.be.equal('PerHourCyclicScheduler');
      break;
    case CyclicSchedulerFactory.klasses.PER_DAY:
      expect(scheduler.constructor.name).to.be.equal('PerDayCyclicScheduler');
      break;
    case CyclicSchedulerFactory.klasses.PER_WEEK:
      expect(scheduler.constructor.name).to.be.equal('PerWeekCyclicScheduler');
      break;
    case CyclicSchedulerFactory.klasses.PER_MONTH:
      expect(scheduler.constructor.name).to.be.equal('PerMonthCyclicScheduler');
      break;
    case CyclicSchedulerFactory.klasses.PER_YEAR:
      expect(scheduler.constructor.name).to.be.equal('PerYearCyclicScheduler');
      break;
  }
}

describe('Basic',function(){

  it('Invalid creation of cyclic schedulers',function(){
    expect(function(){CyclicSchedulerFactory.createCyclicScheduler()}).to.throw(/must be an object/);
    expect(function(){CyclicSchedulerFactory.createCyclicScheduler(false)}).to.throw(/must be an object/);
    expect(function(){CyclicSchedulerFactory.createCyclicScheduler(5)}).to.throw(/must be an object/);
    expect(function(){CyclicSchedulerFactory.createCyclicScheduler([])}).to.throw(/Klass property must be specified/);
    expect(function(){CyclicSchedulerFactory.createCyclicScheduler({})}).to.throw(/Klass property must be specified/);
    expect(function(){CyclicSchedulerFactory.createCyclicScheduler({a : 1})}).to.throw(/Klass property must be specified/);
  });

  it('Creating all kinds of cyclic schedulers',function(){
    var klasses = CyclicSchedulerFactory.createKlassPropertyArray();
    var schedulers = [];
    klasses.forEach(instantiateCyclicScheduler.bind(null,schedulers));
    expect(klasses.length).to.be.equal(schedulers.length);
    schedulers.forEach(checkSchedulerObject.bind(null,klasses));
  });

});
