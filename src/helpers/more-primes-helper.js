import SimpleStringSet from "./simple-string-set.js";
"use strict";
export function build () {
    let morePrimesObj = {};
    let compositeSet = SimpleStringSet.build(509063);
    morePrimesObj.checkIsPrime = function(int) {
        if (compositeSet.contains(int)) {
            return false;
        }
        let maxPossible = Math.sqrt(int);
        for (let i = 2; i < maxPossible; i++) {
            if (int % i == 0) {
                compositeSet.add(int);
                return false;
            }
        }
        for (let i = 2; i < 6; i++) {
            compositeSet.add(int*i);
        }
        return true;
    };

    morePrimesObj.generateComposities = function (arrayOfPrimes) {
        for (let i = 0; i < arrayOfPrimes.length; i++) {
            for (let j = 2; j < 6; j++) {
                compositeSet.add(arrayOfPrimes[i]*j);
            }
        }
    };

    morePrimesObj.morePrimes = function (currentMaxInteger, numNewPrimes) {
        let newPrimes = [];
        let index = currentMaxInteger;
        while (newPrimes.length < numNewPrimes) {
            if (morePrimesObj.checkIsPrime(index)) {
                newPrimes.push(index);
            } else {
                // nothing
            }
            index++;
        }
        morePrimesObj.generateComposities(newPrimes);
        return {
            newIndex : index,
            newPrimes : newPrimes,
            composities : compositeSet.toList()
        };
    };
    morePrimesObj.onmessage = () => {};
    
    morePrimesObj.postMessage = function(data) {
        setTimeout(()=> {
            let result = morePrimesObj.morePrimes(data.currentMaxInteger, data.numNewPrimes);
            morePrimesObj.onmessage({
                data : result
            });
        }, 0);
    };
    return morePrimesObj;
}