<template>
    <div>
        <div class="container">
            <div class="box">
                <div class="art-header">
                    <p class="art-title">{{art.title}}</p>
                    <div class="art-date">
                        <span>作者：{{art.author}}</span>
                        <span>发布时间：{{art.createTime}}</span>
                    </div>

                </div>
                <div class="art-content" v-html="art.context">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { reqGetNotice } from '../../../../api/index'
    export default {
        name: 'art',
        data(){
            return{
                art:{},//文章
                releaseId:''
            }
        },
        created() {
            this.releaseId = this.$route.query.releaseId
            this.getArt()
        },
        methods:{
            getArt(){
                reqGetNotice({id:this.releaseId}).then(res => {
                    if(res.code === 0){
                        this.art = res.data[0]
                        console.log(res.data)
                    } else {

                    }
                })
            }
        }
    };
</script>

<style lang="scss" scoped>
    .container{
        background: url("../../../../assets/img/bg.jpg");
        .box{
            width: 60%;
            min-height: 600px;
            margin: 0 auto;
            .art-header{
                margin-bottom: 20px;
                .art-title{
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 10px;
                }
                .art-date{
                    font-size: 14px;
                    text-align: right;
                    color: #8c939d;
                    span{
                        margin-left: 18px;
                    }
                }
            }
        }
    }
</style>