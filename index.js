function createCycleSchedulerLib(execlib){
  'use strict';

  return {
    CyclicSchedulerFactory: require('./cyclicschedulerfactory.js')(execlib)
  };
}

module.exports = createCycleSchedulerLib;
