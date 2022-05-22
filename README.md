# vue-utils-yy

## 引入
```js main.js
import Vue from 'vue'
import Utils from 'vue-utils-yy'

Vue.use(Utils)
```

### components

#### 1. YTable
```html
<template>
  <YTable :data.sync="tableData" :columns="columns" style="width: 100%" :row-class-name="tableRowClassName" columnSortable rowSortable>
    <el-table-column prop="name" label="姓名" width="180">
      <template v-slot:default="scope"> {{ scope.row.name }}说：家裕大佬带带我！ </template>
      </el-table-column>
  </YTable>
</template>
<script>
export default {
  methods: {
    tableRowClassName({ rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
  },
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ],
      columns: [
        {
          prop: 'date',
          label: '日期',
          width: 180,
        },
        {
          prop: 'name',
          label: '姓名',
          width: 250,
        },
        {
          prop: 'address',
          label: '地址',
        },
      ],
    }
  },
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>
```
#### 2. YScrollContainer
```html
<template>
  <YScrollContainer class="container" :hoverStop="false" :scrollStep="1" direction="up">
    <div>
      <div class="row" v-for="item in list" :key="item.name">
        {{ item.name }}
      </div>
    </div>
    <div>{{ asyncValue }}</div>
  </YScrollContainer>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      asyncValue: '0000000',
    }
  },
  mounted() {
    setTimeout(() => {
      this.list = [
        {
          name: 1,
        },
        {
          name: 2,
        },
        {
          name: 3,
        },
        {
          name: 4,
        },
      ]
    }, 2000)
  },
}
</script>
<style scoped>
.container {
  height: 400px;
  background: red;
}
.row {
  width: 100%;
  height: 100px;
  background: burlywood;
  color: aliceblue;
  text-align: center;
  line-height: 100px;
}
</style>
```

### directives

#### 1. clipboard (复制内容到剪切板)

#### 2. highlight (高亮显示指定文本)

#### 3. selecttext (划词选择显示对应的菜单按钮)

### utils
还未暴露，有需要可以访问GitHub查看源码