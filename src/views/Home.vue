<template>
  <div class="container-fluid mt-2">
    <b-form @submit="click">
      <b-input v-model="input" :placeholder="$t('message')" class="mb-2"></b-input>
      <b-button type="submit">{{$t('try')}}</b-button>
    </b-form>
    <b-card class="mt-2" :header="$t('result')">
      {{$t(result.goal||"unknown")}}
      <p class="text-muted">Distanz: {{result.distance}}</p>
    </b-card>
  </div>
</template>

<script>
// @ is an alias to /src
import {yesNoMaybe} from "@/Levenshtein";

export default {
  name: 'Home',
  data() {
    return {
      input: "",
      result: ""
    }
  },
  components: {
  },
  methods: {
    click(evt) {
      evt.preventDefault();
      this.result = yesNoMaybe(this.input, this.$i18n.locale)

    }
  },
}
</script>
