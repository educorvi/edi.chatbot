<template>
  <div id="app" class="container-fluid mt-2">
    <b-form @submit="click">
      <b-input v-model="input" placeholder="input" class="mb-2"></b-input>
      <b-button type="submit">Go</b-button>
    </b-form>
  </div>
</template>

<script>
import {minimalDistance} from "@/Levenshtein";

export default {
  name: 'App',
  components: {
  },
  methods: {
    click(evt) {
      evt.preventDefault();
      minimalDistance(this.input, ["ja", "nein", "ne"])
      this.input = "";
    }
  },
  data() {
    return {
      input: ""
    }
  },
}
</script>

<style>
#app {
}
</style>
