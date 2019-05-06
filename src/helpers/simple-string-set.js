let SetBuilder = {
    
    build : function(slots) {
        let set = {};
        let hashContainer = [];
        for (let i = 0; i < slots; i++) {
            hashContainer[i] = [];
        }

        let hashFunction = function(str) {
            var hash = 0, i, chr;
            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
                chr   = str.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            hash = hash % slots;
            while (hash < 0) {
                hash += slots;
            }
            return hash % slots;
        }

        set.add = function(newItem) {
            if (set.contains(newItem)) {
                return;
            }
            let hash = hashFunction(newItem);

            hashContainer[hash].push(newItem);
        }
        set.contains = function(someItem) {
            let hash = hashFunction(someItem);
            if (hashContainer[hash] == undefined) {
                return false;
            } else {
                let arr = hashContainer[hash];
                for (let i = 0; i < arr.length; i ++) {
                    if (arr[i] == someItem) {
                        return true;
                    }
                }
                return false;
            }

        }
        set.remove = function(someItem) {
            let hash = hashFunction(someItem);
            if (hashContainer[hash] == undefined) {
                return true;
            } else {
                let arr = hashContainer[hash];
                let newArray = [];
                for (let i = 0; i < arr.length; i ++) {
                    if (arr[i] != someItem) {
                        newArray.push(arr[i]);
                    }
                }
                hashContainer[hash] = newArray;
            }
        }

        set.toList = function() {
            let list = [];
            for (let i = 0; i < hashContainer.length; i++) {
                let slot = hashContainer[i];
                for (let j = 0; j < slot.length; j++) {
                    list.push(slot[j]);
                }
            }
            return list;
        }

        return set;
    }
}




export default SetBuilder;