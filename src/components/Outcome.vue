<template>

</template>

<script>
import diceData from '../config/dice.js';
import util from '../util.js';

const dieTypes = diceData.dieTypes;
const dieResults = diceData.dieResults;

export default {
  name: 'Outcome',
  props: {
    possibilities: {
      type: Array,
      required: true
    },
    outcome: {
      type: String,
      required: true
    }
  }
}
</script>
