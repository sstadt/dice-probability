<template>

  <form @submit.prevent="calculateProbability">
    <div class="row">
      <div class="small-6 medium-3 large-2 columns">
        <label>Ability <input type="number" v-model="ability" /></label>
      </div>
      <div class="small-6 medium-3 large-2 columns">
        <label>Proficiency <input type="number" v-model="proficiency" /></label>
      </div>
      <div class="small-6 medium-3 large-2 columns">
        <label>Boost <input type="number" v-model="boost" /></label>
      </div>
      <div class="small-6 medium-3 large-2 columns">
        <label>Difficulty <input type="number" v-model="difficulty" /></label>
      </div>
      <div class="small-6 medium-3 large-2 columns">
        <label>Challenge <input type="number" v-model="challenge" /></label>
      </div>
      <div class="small-6 medium-3 large-2 columns">
        <label>Setback <input type="number" v-model="setback" /></label>
      </div>
    </div>
    <div class="row">
      <div class="small-12 columns">
        <button type="submit" class="buttom expand">Calculate</button>
      </div>
    </div>
  </form>


</template>

<script>
import diceData from '../config/dice.js';
import util from '../util.js';

const dieTypes = diceData.dieTypes;
const dieResults = diceData.dieResults;

export default {
  name: 'Calculator',
  data() {
    return {
      ability: 0,
      proficiency: 0,
      boost: 0,
      difficulty: 0,
      challenge: 0,
      setback: 0,
      dice: [],
      totalOutcomes: [],
      uniqueOutcomes: []
    };
  },
  methods: {
    calculateProbability() {
      this.populateDice();
      this.populateOutcomes();
    },
    populateDice() {
      this.dice = [];

      for (var i = 0, j = dieTypes.length; i < j; i++) {
        let count = parseInt(this[dieTypes[i]], 10);
        if (this[dieTypes[i]] && count > 0) {
          for (var ii = 0; ii < count; ii++) this.dice.push(dieResults[dieTypes[i]]);
        }
      }
    },
    populateOutcomes() {
      var totalCombos = util.cartesian.apply(null, this.dice);
      var outcomes = totalCombos.map((combo) => {
        var combinedRoll = util.combineRolls.apply(null, combo);
        return util.serializeRoll(combinedRoll);
      });

      this.totalOutcomes = outcomes.sort(util.sortRolls);
      this.uniqueOutcomes = this.totalOutcomes.unique();
    }
  }
}
</script>
