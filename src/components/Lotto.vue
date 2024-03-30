<template>

  <div>
    <div class="row row-cols-1 row-cols-md-2">
      <div class="col mb-1">
        <div class="card text-black bg-light">
          <div class="card-header">
            <h2>{{ documentTitle }}</h2>
          </div>
          <div class="mt-3 mb-3">
            <button
              :disabled="currentNo < 1"
              @click="currentNo -= 1"
            >
              {{currentNo - 1}}회
            </button>
            <span class="big">
              &lt; {{ currentNo }}회 당첨결과 >
            </span>
            <button
              :disabled="currentNo === lastNo"
              @click="currentNo += 1"
            >
              {{currentNo + 1}}회
            </button>
          </div>
          <div class="nums">
              <div class="num win">
                  <p>
                    <!-- {{ getWinNumbers.length }}회 당첨결과: -->
                      <span v-for="(num, i) in getWinNumbers[lastNo - currentNo]" v-bind:key="i"
                          style="transform: scale( .6 );"
                          class="ball_645 lrg mr-10"
                          :class="{
                            ball1: getBallType(num) == 1,
                            ball2: getBallType(num) == 2,
                            ball3: getBallType(num) == 3,
                            ball4: getBallType(num) == 4,
                            ball5: getBallType(num) == 5,
                          }"
                      >
                        {{ num }}
                        <span v-if="i === 6" class="badge badge-pill badge-warning">보너스</span>
                      </span>
                  </p>
              </div>
              <!-- <div class="num bonus">
                  <strong>보너스</strong>
                  <p><span v-for="(num, i) in getWinNumbers[0]" v-bind:key="i"
                      class="ball_645 lrg ball2">
                      {{ num }}
                    </span></p>
              </div> -->
          </div>
        </div>

      <div class="card text-black bg-white">
        <!-- <div class="card-header">
          <h3>추천번호</h3>
        </div> -->
        <div class="card-body">
          <div class="mt-3 mb-3">
            게임수:
            <vue-numeric-input
              class="mr-10 ta-c fw-b"
              style="width: 80px; text-align: right;"
              v-model.number="gameCount"
              controls-type="updown"
              align="right"
              :min="1"
              :max="MAX_GAME_COUNT"
              :step="1"
            />
            &lt; 추천번호 >
          </div>
          <div class="nums">
              <div class="num win">
                  <p v-if="recommWinNumbers.length === 0">
                    추천 번호가 없습니다.
                  </p>
                  <div v-else>
                    <p v-for="(recommNumbers, i) in sorted(recommWinNumbers)" v-bind:key="i">
                      <span v-for="(num, j) in recommNumbers" v-bind:key="j"
                          style="transform: scale( .9 );"
                          class="ball_645 lrg ball1 mr-10"
                          :class="{
                            ball1: getBallType(num) == 1,
                            ball2: getBallType(num) == 2,
                            ball3: getBallType(num) == 3,
                            ball4: getBallType(num) == 4,
                            ball5: getBallType(num) == 5,
                          }"
                      >
                        {{ num }}
                      </span>
                    </p>
                  </div>
              </div>
              <!-- <section class="toutube">
                <div class="youtube-cover"></div>
              </section> -->
              <!-- <div class="num bonus">
                  <strong>보너스</strong>
                  <p><span class="ball_645 lrg ball2">20</span></p>
              </div> -->
          </div>
            <p>
              <button type="button" class="btn btn-primary"
                  v-on:click="doRecommand"
              >
                다른 번호 추천받기
              </button>
              <br/>
            </p>

        </div>
      </div>

      <div>
          <div class="bg-light mt-4">
            <h4 style="padding-left: 30px;">
              &lt; 추천 절차 >
            </h4>
            <div>
                <ol>
                  <li>{{ getWinSize - latelySize - 1 }}회부터
                      {{ getWinSize }}회 당첨번호까지({{ latelySize }}회차) 노출수로 분류</li>
                  <li>분류된 그룹별로 선택수를 지정하여 랜덤하게 번호선택</li>
                  <li>선택된 번호에서 6개의 추천번호를 제공</li>
                </ol>
            </div>
          </div>
      </div>
      <div>
        <button
            v-on:click="toggleConfig">
          <span v-if="!isShowConfig">설정 열기</span>
          <span v-else>설정 닫기</span>
        </button>
      </div>
      <div
        :class="{
          hide: !isShowConfig,
        }"
      >
        <div class="card text-black bg-light mt-3">
          <div class="card-header">
              <strong>{{ getWinSize }}회 부터 최근</strong>
              <!-- <input v-model.number="latelySize" style="width: 80px;" class="ta-c"
                  v-on:change="doInit"> -->
              <vue-numeric-input
                class="mr-10 ta-c fw-b"
                style="width: 80px; text-align: right;"
                v-model.number="latelySize"
                controls-type="updown"
                align="right"
                :min="numericInputParams.min"
                :max="numericInputParams.max"
                :step="numericInputParams.step"
              >
              </vue-numeric-input><strong>회 기준</strong>

              <strong>선택된 번호</strong>
              <span class="badge badge-success">{{ getSelectedNumbersSize }}</span>개
              <!-- <button type="button" class="btn btn-primary btn-sm mr-10"
                  v-on:click="getSelectedNumbers"
                  :disabled="isKeepNumber"
              >
                새로번호받기
              </button> -->

              (<span class="ml-10">
                <input type="checkbox" id="isKeepNumber" v-model="isKeepNumber">
                <label for="isKeepNumber">
                  번호유지
                </label>
              </span>)
          </div>
          <div class="card-body">
            <div class="nums">
              <p v-if="getSelectedNumbersSize === 0">
                선택된 번호가 없습니다.
              </p>
              <p v-else>
                <span v-for="(num, i) in selectedNumbers" v-bind:key="i">
                  <span class="ball_645 lrg"
                    style="transform: scale( .6 );"
                    :class="{
                      ball1: getBallType(num) == 1,
                      ball2: getBallType(num) == 2,
                      ball3: getBallType(num) == 3,
                      ball4: getBallType(num) == 4,
                      ball5: getBallType(num) == 5,
                    }"
                  >
                    {{ num }}
                  </span>

                </span>
              </p>
            </div>

            <div class="row row-cols-1 row-cols-md-2 mt-3"
                v-for="(seed, i) in seeds" :key="i"
            >
              <div
                class="col mb-1"
                v-if="getSize(seed) > 0"
              >
                <div class="card text-black bg-info">
                  <div class="card-header">
                    <strong v-if="i === 0">한 번도 안 나온 숫자</strong>
                    <strong v-else>{{ i }}회 나온 숫자</strong>
                    <strong>{{ getSize(seed) }}개 중<br>
                      <vue-numeric-input
                        class="mr-10 ta-c fw-b"
                        style="width: 80px;"
                        v-model="weights[i]"
                        controls-type="updown"
                        align="right"
                        :min="0"
                        :max="getSize(seed)"
                        :step="1"
                      >
                      </vue-numeric-input>개 선택
                    </strong>
                  </div>
                  <div class="card-body">
                    <div class="nums">
                      <div class="num win">
                        <span v-for="(num, j) in seed" v-bind:key="j">
                          <span class="ball_645 sml mr-10"
                            style="transform: scale( 1.2 );"
                            :class="{
                              ball0: weights[i] === 0,
                              ball1: weights[i] > 0 && getBallType(num) == 1,
                              ball2: weights[i] > 0 && getBallType(num) == 2,
                              ball3: weights[i] > 0 && getBallType(num) == 3,
                              ball4: weights[i] > 0 && getBallType(num) == 4,
                              ball5: weights[i] > 0 && getBallType(num) == 5,
                            }"
                          >
                            {{ num }}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
      </div>
    </div>


  </div>

</template>

<script>
/* eslint-disable */
import VueNumericInput from 'vue-numeric-input'
import { mapGetters, mapMutations, mapActions } from 'vuex'

function getRandomSubarray(arr, size) {
  // console.log('arr', arr)
  var shuffled = arr.slice(0)
  var i = arr.length
  var temp, index

  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled.slice(0, size);
}

/**
 * from, to 사이의 난수를 반환
 */
function getRandomValue(from, to) {

  if (from === to) return from

  return Math.floor((to + 1 - from) * Math.random()) + from
}

export default {
  name: 'lotto',
  components: {
    VueNumericInput
  },
  data() {
    return {
      MAX_GAME_COUNT: 6,
      currentNo: 0,
      lastNo: Number.MAX_VALUE,
      isShowConfig: false,
      latelySize: 11,
      recommWinNumbers: [],
      gameCount: 5, // 기본게임수 설정
      // weights: [4,0,1,2,0,],
      // weights: [2,1,3,1,0,],
      // weights: [6,1,4,3,0,],
      weights: Array(45).fill(0).map((v, i) => i === 0 ? 1 : 0),    // (45) [0,0,...,0]
      seeds: [
        /* 0 */ [1,9,10,25,41,44],
        /* 1 */ [3,4,11,12,13,15,17,24,27,29,31,32,33,34,40,42,43],
        /* 2 */ [5,6,8,14,19,22,23,26,30,35,36,37,38,39,45],
        /* 3 */ [2,7,16,18,28],
        /* 4 */ [20,21],
      ],
      selectedNumbers: [],
      isKeepNumber: !true,
      numericInputParams: {
        min: 5,
        max: 100,
        step: 1
      },
    };
  },
  created() {
    console.log('--- created');
    // console.log('--- ', this.$route.params)
    const { size } = this.$route.params
    console.log('size', size)
    if (size) {
      this.latelySize = Number(size)
      console.log('latelySize', this.latelySize)
    }
    this.lastNo = this.getWinNumbers.length
    this.currentNo = this.lastNo
  },
  mounted() {
    console.log('--- mounted');
    this.doInit()
    this.doRecommand()

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
      $('[data-toggle="popover"]').popover()
    })
  },
  updated() {
    console.log('--- updated');
  },
  methods: {
    ...mapMutations({

    }),
    ...mapActions({
      analysis: 'analysis'
    }),

    doInit() {
      console.log('--- doInit')
      this.analysis(this.latelySize)
      this.seeds = this.getCountList
      this.weights = this.recommandWeights
    },
    doRecommand() {
      console.log('--- doRecommand')
      // this.getSelectedNumbers()
      var { selectedNumbers } = this
      if (!this.isKeepNumber || !selectedNumbers || selectedNumbers.length === 0) {
        selectedNumbers = this.getSelectedNumbers()
      }
      // this.winNumbers = buff.slice(0)
      this.recommWinNumbers = [...Array(this.gameCount).keys()].map(() => {
        return getRandomSubarray(selectedNumbers, 6).sort(function (a, b) { return a - b })
      })
      console.log('recommWinNumbers', this.recommWinNumbers)
    },
    getSelectedNumbers() {
      console.log('--- getSelectedNumbers')
      const { seeds, weights } = this
      console.log('seeds', seeds)
      console.log('weights', weights)

      var buff = []
      for (var i in seeds) {
        // 시드 갯수 이상이면 중단
        // if (i >= seeds.length) break

        var weight = weights[i]
        if (weight > 0) {
          var sample = getRandomSubarray(seeds[i], weight)
          // console.log('sample', sample)
          buff = buff.concat(sample).sort(function (a, b) { return a - b })
          // console.log('buff', buff)
        }
        // console.log(`i = {{i}}`, i)
      }
      this.selectedNumbers = buff.slice(0)

      return this.selectedNumbers
    },
    getBallType(number) {
      return Math.floor((number - 1/* 1~10 */) / 10) + 1
    },
    toggleConfig() {
      this.isShowConfig = !this.isShowConfig
    },
    getSize(obj) {
      return obj && obj.length ? obj.length : 0
    },
    sorted(numbers) {
      console.log('numbers', numbers)
      const csvs = numbers
        .map(x => x.map(y => `0${y}`.substr(-2, 2)))
        .map(x => x.join(','))
      csvs.sort()
      console.log('sored csvs', csvs)
      const numbs = csvs
        .map(x => x.split(','))
        .map(x => x.map(y => Number(y)))
      return numbs
    }
  },
  computed: {
    ...mapGetters({
      getWinSize: 'getWinSize',
      getWinNumbers: 'getWinNumbers',
      getCountList: 'getCountList',
    }),
    recommandWeights() {
      // weights: [4,0,1,2,0,]
      // weights: [2,1,3,1,0,]
      // weights: [1,3,2,0,1,]
      const { seeds } = this
      var recommands = [
        // 최근 노출 빈도 범위의 난수를 가중치로 적용 
        getRandomValue(1, 4),
        getRandomValue(1, 3),
        getRandomValue(1, 3),
        getRandomValue(0, 2),
        getRandomValue(0, 1),
        0,0,0,0,0,
      ]

      // 최소 선택개수 미만일 때, 가중치를 조정
      var minCount = 10
      var sum = recommands.reduce((accumulator, x) => accumulator + x)
      console.log('sum', sum)

      var loop = minCount - sum
      while (loop-- > 0) {
        var index = getRandomValue(0, seeds.length - 1)
        // console.log(recommands[index])
        recommands[index] += 1
        // console.log(recommands[index])
        console.log('[', loop, '] ', 'index', index, 'increased!!'
            , recommands[index], 'sum:'
            , recommands.reduce((accumulator, x) => accumulator + x))
      }
      // for (var i in recommands) {
      //   // console.log('i', i) // 0 1 2 ... 4
      //   var val = recommands[i]

      // }

      var { weights } = this
      try {
        for (var i = 0; i < recommands.length; i++) {
          weights[i] = recommands[i]
        }
      } catch (e) {
        console.error('recommands', recommands, e)
      }

      return weights
    },
    documentTitle() {
      return document.title
    },
    getSelectedNumbersSize() {
      return this.selectedNumbers.length ? this.selectedNumbers.length : 0
    }
  },
  watch: {
    latelySize: function(newVal, oldVal) {
      console.log('newVal, oldVal', newVal, oldVal)
      this.doInit()
    },
  },
};
</script>

<style scoped>
.mr10 {
  margin-right: 10px;
}
.mr20 {
  margin-right: 20px;
}
.big {
  font-size: xx-large;
}
</style>