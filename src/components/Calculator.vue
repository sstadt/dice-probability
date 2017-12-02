<template>

  <div class="row">
    <div class="small-12 column">
      <form @submit.prevent="calculateProbability">
        <div class="row">
          <div class="small-6 medium-4 large-2 columns">
            <label>Ability <input type="number" v-model="ability" /></label>
          </div>
          <div class="small-6 medium-4 large-2 columns">
            <label>Proficiency <input type="number" v-model="proficiency" /></label>
          </div>
          <div class="small-6 medium-4 large-2 columns">
            <label>Boost <input type="number" v-model="boost" /></label>
          </div>
          <div class="small-6 medium-4 large-2 columns">
            <label>Difficulty <input type="number" v-model="difficulty" /></label>
          </div>
          <div class="small-6 medium-4 large-2 columns">
            <label>Challenge <input type="number" v-model="challenge" /></label>
          </div>
          <div class="small-6 medium-4 large-2 columns">
            <label>Setback <input type="number" v-model="setback" /></label>
          </div>
        </div>
        <div class="row">
          <div class="small-12 columns">
            <button type="submit" class="buttom expand">Calculate</button>
          </div>
        </div>
      </form>

      <div class="progress" v-if="progress > 0">
        <span class="meter" :style="progressStyle"></span>
      </div>

      <div class="row">
        <div class="small-12 medium-6 large-3 column">
          <p v-if="successChance !== ''">Success: {{ successChance }}%</p>
        </div>
        <div class="small-12 medium-6 large-3 column">
          <p v-if="critChance !== ''">Crit: {{ critChance }}%</p>
        </div>
        <div class="small-12 medium-6 large-3 column">
          <p v-if="triumphChance !== ''">Triumph: {{ triumphChance }}%</p>
        </div>
        <div class="small-12 medium-6 large-3 column">
          <p v-if="despairChance !== ''">Despair: {{ despairChance }}%</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Combinatorics from 'js-combinatorics';

import diceData from '../config/dice.js';
import util from '../util.js';

const dieTypes = diceData.dieTypes;
const dieResults = diceData.dieResults;

export default {
  name: 'calculator',
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
      uniqueOutcomes: [],
      successChance: '',
      critChance: '',
      triumphChance: '',
      despairChance: '',
      progress: 0
    };
  },
  computed: {
    progressStyle() {
      return {
        width: `${this.progress}%`
      };
    }
  },
  methods: {
    calculateProbability() {
      this.populateDice();
      this.populateOutcomes()
        .then(() => {
          this.populateOverview();
          this.progress = 100;
        });
    },
    populateDice() {
      this.progress = 1;
      this.dice = [];

      for (var i = 0, j = dieTypes.length; i < j; i++) {
        let count = parseInt(this[dieTypes[i]], 10);

        if (this[dieTypes[i]] && count > 0) {
          for (var ii = 0; ii < count; ii++) this.dice.push(dieResults[dieTypes[i]]);
        }
      }
    },
    populateOutcomes() {
      var self = this;

      return new Promise((resolve) => {
        self.progress = 33;
        util.debug('populating combos');
        util.getCartesianProduct.apply(null, self.dice)
          .then((totalCombos) => {
            util.debug(`combo count: ${totalCombos.length}`);

            var outcomes = [];
            var combinedRoll;

            for (var i = 0, j = totalCombos.length; i < j; i++) {
              combinedRoll = util.combineRolls.apply(null, totalCombos[i]);
              outcomes.push(util.serializeRoll(combinedRoll));
            }

            self.progress = 26;
            util.debug('setting totalOutcomes');
            self.totalOutcomes = outcomes;
            util.debug('setting uniqueOutcomes');
            self.uniqueOutcomes = self.totalOutcomes.unique(); // this is a little slow
            util.debug('finished populateOutcomes()');

            resolve();
          });
      });
    },
    populateOverview() {
      this.progress = 66;
      var successes = 0;
      var crits = 0;
      var triumphs = 0;
      var despairs = 0;

      // console.log('populating overview');

      for (var i = 0, j = this.totalOutcomes.length; i < j; i++) {
        let result = util.convertRollToObject(this.totalOutcomes[i]);

        if (util.getRollScore(this.totalOutcomes[i]) > 0) successes++;
        if (result.advantage && result.advantage >= 3) crits++;
        if (result.triumph) triumphs++;
        if (result.despair) despairs++;
      }

      // console.log('statistics populated');

      this.successChance = util.parsePercent(successes / this.totalOutcomes.length);
      this.critChance = util.parsePercent(crits / this.totalOutcomes.length);
      this.triumphChance = util.parsePercent(triumphs / this.totalOutcomes.length);
      this.despairChance = util.parsePercent(despairs / this.totalOutcomes.length);
      // console.log('finishes populating overview');
    }
  }
}
</script>

<style>
table {
  width: 100%;
}
</style>
