/* eslint-disable */

import Vue from 'vue'
import Vuex from 'vuex'
import modWinNumbers from './modules/winNumbers'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        modWinNumbers,
    },
    state: {
        countList: [],
        min: 0,
        max: 0,
    },
    getters: {
        getWinSize(state) {
            return state.modWinNumbers.winNumbers.length
        },
        getWinNumbers(state) {
            return state.modWinNumbers.winNumbers
        },
        getCountList(state) {
            return state.countList
        },
    },
    mutations: {
        analysis(state, latelySize) {
            console.log('latelySize', latelySize)

            var numCounter = {
                count45: Array(45).fill(0).map((v, i) => 0),    // (45) [0,0,...,0]
                getNums() {
                    var max = 0
                    var min = Infinity
                    var sum = 0
                    var avg = 0
                    var nums = {
                        max: [],
                        min: [],
                        avg: [],
                    }
                    
                    for (var n of this.count45) {
                        if (max < n) {
                            max = n
                        }
                        if (min > n && n > 0) {
                            min = n
                        }
                        sum += Number(n)
                    }
                    avg = Math.round(sum / 45)
                    console.log('count sum', sum, 'avg', avg, 'min', min, 'max', max)

                    for (var i in this.count45) {
                        // console.log(i, this.count45[i], max === this.count45[i])
                        var n = this.count45[i]
                        if (max === n) {
                            nums.max.push(Number(i) + 1)
                        }
                        if (min === n) {
                            nums.min.push(Number(i) + 1)
                        }
                        if (avg === n) {
                            nums.avg.push(Number(i) + 1)
                        }
                    }
                    // console.log('maxNums', maxNums)

                    return nums
                },
            }

            var { winNumbers } = state.modWinNumbers
            var /* 회차 */ i = 1
            for (var num7 of winNumbers) {
                if (i > latelySize) break
                // console.log(num7)
                for (var num of num7) {
                    numCounter.count45[num - 1] ++
                }

                i++
            }
            console.log('number count', numCounter.count45)
            console.log('analysis num', numCounter.getNums())

            var countList = []
            for (var i in numCounter.count45) {
                var count = numCounter.count45[i]
                if (!countList[count]) {
                    countList[count] = []
                }
                countList[count].push(Number(i) + 1)
            }
            console.log('countList', countList)
            state.countList = countList
        }
    },
    actions: {
        analysis(context, payload) {
            context.commit('analysis', payload)
        }
    }
})