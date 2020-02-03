const initialState={
    userName:'Frank',
    email:'alinktofrank@gmail.com',
    shopList:[
        {
            title:'Reborn中正台店',
            mainPic:'',
        },
        {
            title:'Reborn新崛江門市',
            mainPic:'',
        },
        {
            title:'Reborn板橋門市',
            mainPic:'',
        },
        {
            title:'Reborn西門門市',
            mainPic:'',
        },
        {
            title:'Reborn豐原門市',
            mainPic:'',
        }
    ],
}

const dashboardReducer=(preState=initialState,action)=>{
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'FETCH_USER_INFO_SUCCESS':
            return Object.assign({},preState,{
                userName:action.userName,
                email:action.isLogin,
                shopList:action.shopList,
            })
            break;
        default:
            return preState
            break;
    }
}

export default dashboardReducer;