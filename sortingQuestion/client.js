const sortAlgos = require("node-sortable");
const request = require("request");
const data = require('./input.json');

// console.log(sortAlgos.quick(data, true))
function compare(a, b) {
    return new Promise((resolve, reject) => {
        request(`http://localhost:8000/comparator?a=${a}&b=${b}`, null, (err, res, body) => {
            if(err) {
                reject(err);
            } else {
                if(body == 1 || body == 0 || body == -1) {
                    setTimeout(() => {
                        resolve(parseInt(body))
                    }, 0);
                } else {
                    reject("unknown response");
                }
            }
        })
    })
}

const merge = (array, fnCompare) =>{
  
    if (!Array.isArray(array) || array.length === 0) return [];
  
    const sort = async (arr) =>{
      const length = arr.length;
      const middle = Math.floor(length * 0.5);
      const left = arr.slice(0, middle);
      const right = arr.slice(middle, length);
  
      if(length === 1) return arr;
  
      return new Promise((resolve, reject) => {
          Promise.all([sort(left), sort(right)]).then(async (results) => {
              const finalarray = await mergeSort(results[0], results[1]);
              resolve(finalarray);
          })
      })
    };
  
    const mergeSort = async (left, right) =>{
      const result = [];
  
      const execLeft = () =>{
        result.push(left.shift());
      };
  
      const execRight = () =>{
        result.push(right.shift());
      };
  
      const execAll = async () =>{
        const result = await fnCompare(left[0], right[0]);
        if(result == 1)
          execLeft();
        else if(result == 0 || result == -1)
          execRight();
      };
  
      while (left.length || right.length) {
        if(left.length && right.length)
          await execAll();
        else if(left.length)
          execLeft();
        else
          execRight();
      }
  
      return result;
    };
  
    return sort(array);
  };

console.time('test')
const sortedData = merge(data, compare).then((result) => {
    console.timeEnd('test');
    console.log(result)
});
console.log(sortedData)
  