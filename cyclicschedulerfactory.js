function cyclicSchedulerFactoryCreator(execlib){
  var lib = execlib.lib;

  var CyclicScheduler = require('./cyclicscheduler.js')(execlib);
  var PerHourCyclicScheduler = require('./perhourcyclicscheduler.js')(execlib,CyclicScheduler);
  var PerDayCyclicScheduler = require('./perdaycyclicscheduler.js')(execlib,CyclicScheduler);
  var PerWeekCyclicScheduler = require('./perweekcyclicscheduler.js')(execlib,CyclicScheduler);
  var PerMonthCyclicScheduler = require('./permonthcyclicscheduler.js')(execlib,CyclicScheduler);
  var PerYearCyclicScheduler = require('./peryearcyclicscheduler.js')(execlib,CyclicScheduler);

  function CyclicSchedulerFactory(){
    this.klasses = {
      PER_HOUR: 'PER_HOUR',
      PER_DAY: 'PER_DAY',
      PER_WEEK: 'PER_WEEK',
      PER_MONTH: 'PER_MONTH',
      PER_YEAR: 'PER_YEAR'
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
    }
  }

  return new CyclicSchedulerFactory();
}

module.exports = cyclicSchedulerFactoryCreator;
