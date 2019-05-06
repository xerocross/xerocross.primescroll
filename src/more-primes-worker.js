import {build as getMorePrimesHelper} from "./helpers/more-primes-helper";

const morePrimesHelper = getMorePrimesHelper();

onmessage = function(e) {
    let result = morePrimesHelper.morePrimes(e.data.currentMaxInteger, e.data.numNewPrimes);
    postMessage(result);
};