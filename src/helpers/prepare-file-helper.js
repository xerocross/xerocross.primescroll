export default {
    process (arr) {
        let text = "";
        let last = arr.length - 1;
        for (let i = 0; i < last; i++) {
            text += arr[i] + "\n";
        }
        text += arr[last];
        return text;
    }
}