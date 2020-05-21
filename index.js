// import userManagement from './src/views/userManagement'
// import roleManagement from './src/views/roleManagement'
// import dataPermissionManage from './src/views/dataPermissionManage'
// import sourceManage from './src/views/systemManagement/sourceManage'
// import loginLog from './src/views/loginLog'
// import resourceAccess from './src/views/resourceAccess'
// import fileManagement from './src/views/fileManagement'
// import announcement from './src/views/announcement'
// import international from './src/views/international'
// // 定义 Loading 对象
// const Loading = {
//   // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
//   install: function(Vue) {
//     Vue.component('roleManagement', roleManagement)
//     Vue.component('userManagement', userManagement)
//     Vue.component('dataPermissionManage', dataPermissionManage)
//     Vue.component('sourceManage', sourceManage)
//     Vue.component('fileManagement', fileManagement)
//     Vue.component('announcement', announcement)
//     Vue.component('international', international)
//     Vue.component('loginLog', loginLog)
//     Vue.component('resourceAccess', resourceAccess)
//   }
// }
// // 导出
// export default Loading
module.exports = function(path) {
  const arr = path.split('$systemManagement')
  const component = arr[arr.length - 1]
  return function() {
    return import('./src/views' + component + '.vue')
  }
}
