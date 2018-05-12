// ctx.request:是Koa2中context经过封装的请求对象，它用起来更直观和简单
// ctx.req:是context提供的node.js原生HTTP请求对象,可以获取更多内容
// ctx.method 得到请求类型

const Koa = require('koa')
const app = new Koa()

app.use(async (ctx) => {
  // 当请求是get请求时，显示表单
  if(ctx.url==='/' && ctx.method ==='GET'){
    let html=`
    <h1>Koa2 request post demo</h1>
    <form method="POST"  action="/">
        <p>userName</p>
        <input name="userName" /> <br/>
        <p>age</p>
        <input name="age" /> <br/>
        <p>webSite</p>
        <input name='webSite' /><br/>
        <button type="submit">submit</button>
    </form>
    `
    ctx.body=html
  }else if(ctx.url==='/' && ctx.method==='POST'){
    //post请求
    let postData= await parsePostData(ctx)
    ctx.body=postData
  }else {
    ctx.body='<h1>404!</h1>'
  }
})
// 解析node原生post参数
function parsePostData(ctx) {
  return new Promise((resolve,reject) => {
    try{
      let postdata=""
      ctx.req.on('data',(data)=>{
        postdata+=data
      })
      ctx.req.addListener('end',(data)=>{
        let parseData=parseQueryStr(postdata)
        resolve(parseData)
      })
    }catch(error){
      reject(error)
    }
  })
}
// post 字符串解析成json对象
function parseQueryStr(queryStr){
  let queryData={}
  let queryStrList=queryStr.split('&')
  for(let [index,queryStr] of queryStrList.entries()){
    let itemList = queryStr.split('=')
    queryData[itemList[0]]=decodeURIComponent(itemList[1])
  }
  return queryData
}
app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')