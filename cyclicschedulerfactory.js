function cyclicSchedulerFactoryCreator(execlib){
  var lib = execlib.lib;

  var CyclicScheduler = require('./cyclicscheduler.js')(execlib);
  var PerHourCyclicScheduler = require('./perhourcyclicscheduler.js')(execlib,CyclicScheduler);
  var PerDayCyclicScheduler = require('./perdaycyclicscheduler.js')(execlib,CyclicScheduler);
  var PerWeekCyclicScheduler = require('./perweekcyclicscheduler.js')(execlib,CyclicScheduler);
  var PerMonthCyclicScheduler = require('./permonthcyclicscheduler.js')(execlib,CyclicScheduler);
  var PerYearCyclicScheduler = require('./peryearcyclicscheduler.js')(execlib,CyclicScheduler);
  var AdaptiveScheduler = require('./adaptivescheduler.js')(execlib,CyclicScheduler);
  var adaptive1_timespanDifferentials = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 15*1000, 30*1000, 60*1000, 120*1000, 300*1000, 600*1000, 900*1000, 1200*1000, 1800*1000,3600*1000, 2*3600*1000, 6*3600*1000, 24*3600*1000];

  function CyclicSchedulerFactory(){
    this.klasses = {
      PER_HOUR: 'PER_HOUR',
      PER_DAY: 'PER_DAY',
      PER_WEEK: 'PER_WEEK',
      PER_MONTH: 'PER_MONTH',
      PER_YEAR: 'PER_YEAR',
      ADAPTIVE_1: 'ADAPTIVE_1'
    };
  }

  CyclicSchedulerFactory.prototype.destroy = function(){
    this.klasses = null;
  };

  CyclicSchedulerFactory.prototype.klassPropertyFiller = function(arry, value, key){
    arry.push(value);
  };

  CyclicSchedulerFactory.prototype.createKlassPropertyArray = function(){
    var ret = [];
    lib.traverseShallow(this.klasses,this.klassPropertyFiller.bind(this,ret));
    return ret;
  };

  CyclicSchedulerFactory.prototype.createCyclicScheduler = function(prophash){
    if (!lib.isVal(prophash) || ('object' !== typeof prophash)){
      throw new lib.Error('NO_PROPHASH','Prophash must be an object');
    }
    var klass = prophash.klass;
    if (!prophash.klass){
      throw new lib.Error('NO_KLASS_PROPERTY','Klass property must be specified. Allowed klass properties: ' + this.createKlassPropertyArray().toString());
    }
    if (!this.klasses[prophash.klass]){
      throw new lib.Error('INVALID_KLASS_PROPERTY','Klass property must be one of these: ' + this.createKlassPropertyArray().toString());
    }
    switch (prophash.klass){
      case this.klasses.PER_HOUR:
        return PerHourCyclicScheduler.createPerHourScheduler(prophash);
        break;
      case this.klasses.PER_DAY:
        return new PerDayCyclicScheduler(prophash);
        break;
      case this.klasses.PER_WEEK:
        return new PerWeekCyclicScheduler(prophash);
        break;
      case this.klasses.PER_MONTH:
        return new PerMonthCyclicScheduler(prophash);
        break;
      case this.klasses.PER_YEAR:
        return new PerYearCyclicScheduler(prophash);
        break;
      case this.klasses.ADAPTIVE_1:
        prophash.timespanDifferentials = adaptive1_timespanDifferentials;
        return new AdaptiveScheduler(prophash);
        break;
    }
  }

  return new CyclicSchedulerFactory();
}

module.exports = cyclicSchedulerFactoryCreator;
