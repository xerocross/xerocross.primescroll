<template>
    <div
        ref="main"
        class="scroll-div"
    >
        <slot></slot>
    </div>
</template>
<script>
export default {
    mounted () {
        let element = this.$refs.main;
        const onscrollHandler = () => {
            let test = (element.scrollHeight - element.scrollTop) - 20 <= element.clientHeight;
            if (test)
            {
                this.$emit("OVERSCROLL_EVENT");
            }
        }
        element.onscroll = () => {
            this.$emit("SCROLL_EVENT");
            onscrollHandler();
        }
    }
}
</script>
<style lang="scss">
.scroll-div {
    overflow : scroll
}
</style>