<template>
    <div class="inf-prime-scroll">
        <p>
            This is a list of prime numbers being generated right now
            on your computer.  There is no logical or pre-set upper 
            limit on the computation.  The only limits are practical.
            It depends on your computer's speed and memory, and the 
            maximum integer size your browser will allow.
        </p>
        <scroll-div @OVERSCROLL_EVENT="morePrimes">
            <div 
                class="prime-list"
            >
                <ul class="list-group primes-list-outer">
                    <li 
                        v-for="(p, index) in primes"
                        :key="p" 
                        class="list-group-item prime-item"
                    >
                        <span class="prime-item-index">(#{{ index+1 }})</span>&nbsp;&nbsp;&nbsp;<span class="prime-item-number">{{ p }}</span>
                    </li>
                    <li 
                        
                        class="busy list-group-item"
                    >
                        <p>
                            <img 
                                v-show="working"
                                class="busy-icon"
                                :src="busyImageUrl" 
                                height="40" 
                                width="40"
                            />
                        </p>
                    </li>
                </ul>
            </div>
        </scroll-div>
        <div class="btn-group">
            <a 
                ref="download" 
                class="btn btn-secondary download-button"
                download="primes.txt"
                :href="downloadDataHref"
            >Download List</a>
        </div>
    </div>
</template>
<script>
import SimpleHashSet from "../helpers/simple-string-set.js";
import ScrollDiv from "./scroll-div.vue";
import PrepareFileHelper from "../helpers/prepare-file-helper.js";
import { build as buildMorePrimesHelper } from "../helpers/more-primes-helper.js";

export default {
    components : {
        ScrollDiv
    },
    props : {
        primeWorkerUrl : {
            type : String,
            default : ""
        },
        busyImageUrl : {
            type : String,
            default : ""
        }
    },
    data () {
        return {
            primes : [],
            currentMaxInteger : 2,
            compositeSet : null,
            primeSet : null,
            moreToAddEachTime : 200,
            working : false,
            morePrimesWorker : null
        };
    },
    computed : {
        downloadDataHref () {
            let text = PrepareFileHelper.process(this.primes);
            return 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
        },

    },
    mounted () {
        this.compositeSet = SimpleHashSet.build(509063);
        if (typeof Worker == "function" && this.primeWorkerUrl.length > 0) {
            this.morePrimesWorker = new Worker(this.primeWorkerUrl);
        } else {
            this.morePrimesWorker = buildMorePrimesHelper();
        }
        this.morePrimes();
    },
    methods : {
        morePrimes () {
            let self = this;
            if (this.working == true) {
                return;
                // do nothing;
            }
            this.working = true;
            self.$emit("WORKING_EVENT");
            let data = {
                currentMaxInteger : this.currentMaxInteger,
                numNewPrimes : this.moreToAddEachTime
            };
            
            this.morePrimesWorker.onmessage = function(e) {
                let newPrimes = e.data.newPrimes;
                for (let i = 0; i < newPrimes.length; i++) {
                    self.primes.push(newPrimes[i]);
                }
                self.currentMaxInteger = e.data.newIndex;
                self.working = false;
                self.$emit("MOREPRIMES_EVENT");
            };
            this.morePrimesWorker.postMessage(data);
        }
    }
};
</script>
<style lang="scss">
.inf-prime-scroll {
    .prime-list {
        height: 300px;
        border-color: rgb(83, 83, 83);
    }
    .busy {
        height: 80px;
        text-align: center;

    }
    .prime-item:nth-child(odd) {
        background-color: rgb(240, 240, 240);
    }
    .btn-group {
        margin-top: 1em;
    }
}
</style>