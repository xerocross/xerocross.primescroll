import SimpleStringSet from "./helpers/simple-string-set.js";
let compositeSet = SimpleStringSet.build(509063);

function checkIsPrime (int) {
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
}

function generateComposities(arrayOfPrimes) {
    for (let i = 0; i < arrayOfPrimes.length; i++) {
        for (let j = 2; j < 6; j++) {
            compositeSet.add(arrayOfPrimes[i]*j);
        }
    }
}

function morePrimes (currentMaxInteger, numNewPrimes) {
    let newPrimes = [];
    let index = currentMaxInteger;
    while (newPrimes.length < numNewPrimes) {
        if (checkIsPrime(index)) {
            newPrimes.push(index);
        } else {
            //this.compositeSet.add(index);
        }
        index++;
    }
    generateComposities(newPrimes);
    return {
        newIndex : index,
        newPrimes : newPrimes,
        composities : compositeSet.toList()
    };
}

onmessage = function(e) {
    let result = morePrimes(e.data.currentMaxInteger, e.data.numNewPrimes);
    postMessage(result);
}