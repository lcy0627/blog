/*
 * @Author: lcy 1035601195@qq.com
 * @Date: 2023-03-01 16:20:17
 * @LastEditors: lcy 1035601195@qq.com
 * @LastEditTime: 2023-06-08 17:31:37
 * @FilePath: \vue-blog\src\store\modules\likes.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from 'store'
import base from '@/config/base.config'
import Vue from 'vue'
const { LIKES_NAME } = base
export default {
  //当前用户点赞文章列表
  namespaced: true,
  state: {
    likes: store.get(LIKES_NAME) || []
  },
  getters: {
    // 文章是否存在于当前用户点赞列表
    isLike: state => (aid) => {
      return !!(state.likes.includes(aid))
    }
  },
  mutations: {
    CHANGE_LIKES (state) {
      state.likes = store.get(LIKES_NAME)
    }
  },
  actions: {
    pushLike ({ commit }, payload) {
      let { aid } = payload
      if (aid) {
        let localLikes = store.get(LIKES_NAME) || []
        let idx = localLikes.indexOf(aid)
        if (idx === -1) {
          localLikes.push(aid)
        }
        store.set(LIKES_NAME, localLikes)
        commit('CHANGE_LIKES')
      }
    },
    pullLike ({ commit }, payload) {
      let { aid } = payload
      console.log(aid)
      if (aid) {
        let localLikes = store.get(LIKES_NAME) || []
        let idx = localLikes.indexOf(aid)
        if (idx !== -1) {
          localLikes.splice(idx, 1)
        }
        store.set(LIKES_NAME, localLikes)
        console.log(localLikes)
        commit('CHANGE_LIKES')
      }
    },
    async sendLikes ({ }, { aid }) {
      await Vue.prototype.$api({ type: 'articleLikes', data: { id: aid } })
    }
  },
  modules: {

  }
}