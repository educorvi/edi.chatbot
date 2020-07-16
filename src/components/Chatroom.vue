<template>
    <div>
        <transition-group name="chat">
            <chatmessage v-for="(item, index) in items" :message="item" :old="index>1" :key="item.text+item.time.getMilliseconds()+item.isSelf"/>
        </transition-group>
    </div>
</template>

<script>
    import Chatmessage from "../components/Chatmessage";
    export default {
        name: "Chatroom",
        components: {Chatmessage},
        props: {
            items: {
                type: Array,
                required: true
            }
        }
    }
</script>

<style scoped>
    .chat-enter-active, .chat-leave-active {
        transition: all 0.2s;
    }
    .chat-enter, .chat-leave-to /* .chat-leave-active below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(-30px);
    }
    .chat-move {
        transition: transform 0.2s;
    }
</style>
