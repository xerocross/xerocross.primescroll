import { shallowMount, mount } from "@vue/test-utils";
import InfPrimeScroll from "./inf-prime-scroll.vue";
import ScrollDiv from "./scroll-div.vue";
import {build as getMorePrimesHelper } from "../helpers/more-primes-helper";


function getPrimesListOuter (infPrimeScroll) {
    return infPrimeScroll.find(".primes-list-outer");
}

function primeListScrollDiv (infPrimeScroll) {
    return infPrimeScroll.find(".prime-list");
}

function getPrimeItems (infPrimeScroll) {
    return primeListScrollDiv(infPrimeScroll).findAll("li.prime-item");
}

function triggerOverScroll (infPrimeScroll) {
    infPrimeScroll.find(ScrollDiv).vm.$emit('OVERSCROLL_EVENT');
}

function getBusyIcon (infPrimeScroll) {
    return infPrimeScroll.find(".busy-icon");
}

beforeEach(()=> {
    window.Worker = () => {
        throw new Error("Worker not specified");
    };
});

test("can mount component, no web worker", () => {
    window.Worker = undefined;
    expect(() => {
        shallowMount(InfPrimeScroll);
    }).not.toThrow();
});

test("primes list renders", function() {
    window.Worker = undefined;
    let infPrimeScroll = mount(InfPrimeScroll);
    expect(getPrimesListOuter(infPrimeScroll).exists()).toBe(true);
});

test("if working, show busy icon", (done) => {
    let infPrimeScroll = mount(InfPrimeScroll, {});
    infPrimeScroll.vm.$watch("working", () => {
        if (infPrimeScroll.vm.working == true) {
            expect(getBusyIcon(infPrimeScroll).isVisible()).toBe(true);
            infPrimeScroll.destroy();
            done();
        }
    });
    setTimeout(()=>{
        triggerOverScroll(infPrimeScroll);
    }, 0);
});

test("after initial mount, list of primes is nonempty, worker null", function(done) {
    window.Worker = undefined;
    let infPrimeScroll;
    infPrimeScroll = mount(InfPrimeScroll, {});
    infPrimeScroll.vm.$on("MOREPRIMES_EVENT", () => {
        let primesList = getPrimeItems(infPrimeScroll);
        expect(primesList.length > 0).toBe(true);
        done();
    });
});

test("overscroll event loads more primes, worker null", function(done) {
    window.Worker = undefined;
    let infPrimeScroll = mount(InfPrimeScroll, {});
    let initialLength;


    infPrimeScroll.vm.$on("MOREPRIMES_EVENT", function() {
        infPrimeScroll.vm.$nextTick(()=>{
            let primesList = getPrimeItems(infPrimeScroll);
            let newLength = primesList.length;
            expect(newLength > initialLength).toBe(true);
            done();
            infPrimeScroll.destroy();
        });
    });
    infPrimeScroll.vm.$nextTick(() => {
        initialLength = getPrimeItems(infPrimeScroll).length;
        triggerOverScroll(infPrimeScroll);
    },0);

    
});

test("can mount component with worker", () => {
    window.Worker = function() {
        this.onmessage = () => {};
        this.postMessage = () => {};
    };
    expect(() => {
        shallowMount(InfPrimeScroll);
    }).not.toThrow();
});

test("can get more primes with worker", (done) => {
    let morePrimesHelper = getMorePrimesHelper();
    window.Worker = function() {
        this.onmessage = () => {};
        this.postMessage = (data) => {
            morePrimesHelper.onmessage = (msg) => {
                this.onmessage(msg);
            };
            morePrimesHelper.postMessage(data);
        };
    };

    let infPrimeScroll = mount(InfPrimeScroll, {});
    let initialLength;
    infPrimeScroll.vm.$on("MOREPRIMES_EVENT", function() {
        infPrimeScroll.vm.$nextTick(()=>{
            let primesList = getPrimeItems(infPrimeScroll);
            let newLength = primesList.length;
            expect(newLength > initialLength).toBe(true);
            infPrimeScroll.destroy();
            done();
        });
    });
    infPrimeScroll.vm.$nextTick(() => {
        initialLength = getPrimeItems(infPrimeScroll).length;
        infPrimeScroll.find(ScrollDiv).vm.$emit('OVERSCROLL_EVENT');
    },0);
    
});