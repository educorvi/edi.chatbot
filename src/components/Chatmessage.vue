<template>
    <div :class="(message.isSelf?'rightDiv':'leftDiv')+' '+(old?'oldDiv':'')">
        <b-card no-body class="message">
            <b-card-header v-if="!message.isSelf">
                <p class="m-n2" style="font-size: small">Bot</p>
            </b-card-header>
            <b-card-body>
                <p class="m-n2 mt-n3">{{message.text}}</p>
                <p class="mt-2 mb-n3 mr-n3 text-muted float-right">{{!isToday(message.time)?date+", ":""}} {{message.time.toLocaleTimeString()}}</p>
            </b-card-body>
        </b-card>
    </div>

</template>

<script>
    //TODO Übersetzen!
    //@group Chatroom
    //Stellt eine einzelne Chatnachricht dar
    export default {
        name: "Chatmessage",
        props: {
            //Die Nachricht, die angezeigt werden soll
            message: {
                type: Object,
                required: true
            },
            old: {
                type: Boolean
            }
        },
        computed: {
            //Gibt das Datum in formatierter Form zurück
            date() {
                const d = this.message.time;
                const dtf = new Intl.DateTimeFormat('de', { year: 'numeric', month: '2-digit', day: '2-digit' })
                const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(d)
                return `${da}.${mo}.${ye}`
            }
        },
        methods: {
            //Prüft ob ein Datum der aktuelle Tag ist
            //@arg Datum in Form eines ```Date``` Objekts
            isToday(someDate) {
                const today = new Date()
                return someDate.getDate() === today.getDate() &&
                    someDate.getMonth() === today.getMonth() &&
                    someDate.getFullYear() === today.getFullYear()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .message {
        margin-top: 10px;
        max-width: 80%;
        width: fit-content;
    }
    .messageDivs {
        width: 100%;
        display: flex;
    }
    .leftDiv {
        @extend .messageDivs;
        justify-content: flex-start;
    }
    .rightDiv {
        @extend .messageDivs;
        justify-content: flex-end;
    }
    .oldDiv {
        opacity: 0.42;

    }
</style>
