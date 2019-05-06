import Vue from "vue";
import InfPrimeScroll from "./components/inf-prime-scroll.vue";

new Vue({
    el : "#prime-scroll",
    components : {
        InfPrimeScroll
    },
    render : function (createElement) {
        return createElement(InfPrimeScroll, {
            props : {
                busyImageUrl : "/busy3.gif",
                primeWorkerUrl : "/more-primes-worker.js"
            },
        });
    }
});