<template>
  <div>
    <el-dialog :title="title"
               :visible.sync="isShow"
               :width="width"
               :before-close="close">
      <BaseForm v-if="formType"
                :type="type"
                ref="form" />
      <div slot="footer"
           class="dialog-footer">
        <el-button v-for="btn in btns"
                   :key="btn.targetName"
                   @click="handlerBtn(btn.targetName,btn.isSubmit)">{{btn.name}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MODAL_DATA from '@/config/modal.config'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('modal')

import BaseForm from './BaseForm'
export default {
  name: 'BaseModal',
  components: {
    BaseForm
  },
  data () {
    return {

    }
  },

  computed: {
    ...mapState(['isShow', 'type']),
    title () {
      return MODAL_DATA[this.type]?.title ?? '默认modal'
    },
    width () {
      return MODAL_DATA[this.type]?.width ?? '60%'
    },
    formType () {
      return MODAL_DATA[this.type]?.formType
    },
    needUpdate () {
      return MODAL_DATA[this.type]?.needUpdate
    },
    btns () {
      return MODAL_DATA[this.type]?.btns ?? [{
        targetName: 'close',
        name: '取消'
      },
      {
        targetName: 'confirm',
        name: '提交',
      }]
    }
  },
  mounted () {

  },
  methods: {
    handlerBtn (action, isSubmit) {
      //事件代理 close confirm
      if (isSubmit) {
        this.submitForm()
        return
      }
      this[action] && this[action]()
    },
    submitForm () {
      if (!this.formType) {
        return false
      }
      let refForm = this.$refs['form']
      refForm.$refs['elForm'].validate(async (valid) => {
        if (valid) {
          try {
            await this.$api({ type: this.formType, data: refForm.form })
            refForm.$refs['elForm'].resetFields()
            this.close()
            if (this.needUpdate) {
              this.$EventBus.$emit('updateView')
            }
          } catch (err) {
            refForm.$refs['elForm'].resetFields()
          }
        } else {
          return false;
        }
      });
    },

    ...mapActions(['close', 'open', 'confirm'])
  },
};
</script>

<style lang="scss" scoped>
</style>

