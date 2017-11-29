<template>
  <tr>
    <td>{{ outcome }}</td>
    <td>{{ successStr }}</td>
    <td>{{ probability }}%</td>
  </tr>
</template>

<script>
import diceData from '../config/dice.js';
import util from '../util.js';

const dieTypes = diceData.dieTypes;
const dieResults = diceData.dieResults;

export default {
  name: 'outcome',
  props: {
    possibilities: {
      type: Array,
      required: true
    },
    outcome: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      score: util.getRollScore(this.outcome),
      result: util.deserializeRoll(this.outcome),
      successStr: this.score > 0 ? 'success' : 'failure',
      probability: 0
    };
  },
  mounted() {
    var chance = util.occurancesInArray(this.outcome, this.possibilities) / this.possibilities.length;
    this.probability = util.parsePercent(chance);
  }
}
</script>
