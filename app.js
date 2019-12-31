const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify');
const fs = require('fs');

const convertEntryType = (entryType) => {
  switch(entryType) {
    case 'sower':
      return 'A';
    case 'tender':
      return 'M';
    case 'agent':
      return 'D';
    default:
      return 'M';
  }
}

const lookupColor = (whClass) => {
  switch(whClass) {
    case 'C1':
      return 'E9967A';
    case 'C2':
      return 'FA8072';
    case 'C3':
      return 'FF6347';
    case 'C4':
      return 'FF4500';
    case 'C5':
      return 'FF0000';
    case 'C6':
      return 'DC143C';    
    default:
      return 'FFFFFF';
  };
};

// const lookupColor = (whClass) => {
//   switch(whClass) {
//     case 'C1':
//       return '5151FF';
//     case 'C2':
//       return '00A8A8';
//     case 'C3':
//       return '00A800';
//     case 'C4':
//       return 'A8A800';
//     case 'C5':
//       return 'A85400';
//     case 'C6':
//       return 'A80000';    
//     default:
//       return 'FFFFFF';
//   };
// };


const records = parse(fs.readFileSync(__dirname+'/2019-1124_sows_tends.csv', ), {
    from_line: 2,
    columns: ['InitialSeedDate', 'ActivityDate', 'EntryType', 'System', 'Pilot', 'class', 'regionName', 'age'],
  on_record: (record) => {
    if(! record.ActivityDate) return null;
    return [
      new Date(record.ActivityDate).getTime()/1000,
      record.Pilot,
      convertEntryType(record.EntryType), 
      record.System.slice(0,4) + '/' + record.System,
      // record.regionName + '/' + record.System,
      lookupColor(record.class)
    ]
  }
})

const expireRecords = [];

const ageTracker = {};
records.forEach(i => {
  // ageTracker shape:  {system: timestamp}
  Object.keys(ageTracker).forEach(key => {
    if ((i[0] - ageTracker[key]) > 2591999) {
      expireRecords.push(
        [
          i[0],
          'Expiry',
          'D', 
          key,
          ''
        ]
      );
      ageTracker[key] = Number.MAX_SAFE_INTEGER;
    } 
  })
  ageTracker[i[3]] = i[0];
});
const out = fs.createWriteStream(__dirname+'/outfile_style_2.log');
stringify(
  records.concat(expireRecords).sort((a,b) => a[0] - b[0])
  , {delimiter: '|'}).pipe(out);
// console.log(expireRecords);
// console.log(records);
// console.log(records.concat(expireRecords));
// console.log(recordsWithDeletes);
// console.log(ageTracker);