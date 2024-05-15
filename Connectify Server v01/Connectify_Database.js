/*Required Files*/
const { get } = require('http');
const db_sql=require('mssql/msnodesqlv8');
/*Configuration*/
const config={
    connectionString: "DSN=Connectify;UID=sa;PWD=032340;" /*SQL System Adminstrator UID/PASS DSN ODBC driver*/
};
/*Module Exports*/
module.exports={Login_Check,
    Registration,
    Registration_Check,
    Get_User,
    Insert_Data,
    Get_Post,
    Get_PostAll,
    Get_Profile,
    Insert_Like,
    Like_Check,
    Comments_Return,
    Insert_Comment,
    Search_Friend,
    Addfriend,
    Check_Friends,
    AddRequest,
    GetRequest,
    RejectR,
    AcceptF,
    Insert_Online,
    Remove_Online,
    Get_Friends,
    Friend_Check,
    Remove_Friend
};

/******************************Query Functions*******************/

/**Login/Reg Page Queries******/
function Login_Check(email,password,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("\nDatabase SQL Connection failed!\n"); returnback(false);}
        let  query_exec=new db_sql.Request();
        let exec_procedure=`
        declare @check_flag int
        exec Login_Check
        @email =@user_mail,
        @pass = @password,
        @flag=@check_flag output
        select @check_flag as lflag`;
        query_exec.input('user_mail',db_sql.VarChar,email);
        query_exec.input('password',db_sql.VarChar,password);
        query_exec.query(exec_procedure,(query_error,res)=>{
            if(query_error){console.log("\nLogin Query Failed!: "+query_error); returnback(false);}
            console.log("****For Debugging Login Query ******\n"+ exec_procedure+" For"+ email+password+"\n*************");   
            returnback(res.recordset);
            })
         })
}

function Insert_Online(user_id,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("Connection Error!\n"); returnback(false);}
        let query_exec=new db_sql.Request();
        let insertonlineq=`
        update Account_Details
        set online=1
        where user_id = @user_id;`;
        query_exec.input('user_id',db_sql.Int,user_id);
        query_exec.query(insertonlineq,(query_error,res)=>{
            if(query_error){console.log("Insert_Online Query Failed!: "+query_error); returnback(false);}else{
                console.log("****For Debugging Insert_Online Query ******\n"+ insertonlineq+" For: "+user_id+"\n*************");
                    returnback(true);
            } 
        })
    })
}

function Remove_Online(user_id,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("Connection Error!\n"); returnback(false);}
        let query_exec=new db_sql.Request();
        let removelineq=`
        update Account_Details
        set online=0
        where user_id = @user_id;`;
        query_exec.input('user_id',db_sql.Int,user_id);
        query_exec.query(removelineq,(query_error,res)=>{
            if(query_error){console.log("Remove_Online Query Failed!: "+query_error); returnback(false);}else{
                console.log("****For Debugging Remove_Online Query ******\n"+ removelineq+" For: "+user_id+"\n*************");
                    returnback(true);
            } 
        })
    })
}

function Registration(username,email,password,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("\nDatabase SQL Connection failed!\n"); returnback(false);};
        let  query_exec=new db_sql.Request();
        let register_query=`
            Insert into Account_Details(user_name,user_email,user_pass)
            values (@username,@email,@password);`
        query_exec.input('username',db_sql.VarChar,username);
        query_exec.input('email',db_sql.VarChar,email);
        query_exec.input('password',db_sql.VarChar,password);

        query_exec.query(register_query,(query_error)=>{
            if(query_error){console.log("Registration Query Failed!: "+query_error); returnback(false);}
            console.log("****For Debugging Registery Query ******\n"+ register_query+" For"+ username+email+password+"\n*************");   
            returnback(true);
        })
    })

}
function Registration_Check(user_name,email,returnback){
        db_sql.connect(config,(error)=>{
            if(error){console.log("\nDatabase SQL Connection failed!\n"); returnback(false);};
            let query_exec=new db_sql.Request();
            let exec_procedure=`
            declare @check_flag int
            exec Reg_Check
            @user =@username,
            @email = @email,
            @flag=@check_flag output
            select @check_flag as rflag`;
            query_exec.input('username',db_sql.VarChar,user_name);
            query_exec.input('email',db_sql.VarChar,email);
            query_exec.query(exec_procedure,(query_error,res)=>{
                if(query_error){console.log("Reg_Check Query Failed!: "+query_error); returnback(false);}
                console.log("****For Debugging Reg_Check Query ******\n"+ exec_procedure+" For"+ user_name+email+"\n*************");   
                returnback(res.recordset);
                })
             })
}
function Get_User(email,password,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("\nDatabase SQL Connection failed!\n"); returnback(false);};
        let query_exec=new db_sql.Request();
        let get_user=`
            Select user_id,user_name from Account_Details
            where user_email like @email and user_pass like @password
        `;
        query_exec.input('email',db_sql.VarChar,email);
        query_exec.input('password',db_sql.VarChar,password);
        query_exec.query(get_user,(query_error,res)=>{
            if(query_error){console.log("Get_User Query Failed!: "+query_error); returnback(false);}
            console.log("****For Debugging Get_User Query ******\n"+ get_user+" For"+ email+password+"\n*************");   
            returnback(res.recordset);
        })
    })
}
function Get_Profile(user_id,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("\nDatabase SQL Connection failed!\n"); returnback(false);};
        let query_exec=new db_sql.Request();
        let get_profile= `select * from Account_Details where user_id = @user_id`
        query_exec.input('user_id',db_sql.Int,user_id);
        query_exec.query(get_profile,(query_error,res)=>{
            if(query_error){console.log("Get_Profile Query Failed!: "+query_error); returnback(false);}
            console.log("****For Debugging Get_Profile Query ******\n"+ get_profile+" For"+ user_id+"\n*************");  
            returnback(res.recordset);
        })
    })
}

/***Profile/Edit************* */
function Insert_Data(post_id,user_id,post_type,post_date,introduction,profile_pic,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("\nInsert Data Query Generally failed!"); returnback(false)}
        query_exec=new db_sql.Request();
        let insert_query =  `
                Insert into User_Post (post_id,user_id,post_type,post_date,Introduction)
                values (@post_id,@user_id,@post_type,@post_date,@Introdcution);
        `;
        query_exec.input('post_id',db_sql.Int,post_id);
        query_exec.input('user_id',db_sql.Int,user_id);
        query_exec.input('post_type',db_sql.VarChar,post_type);
        query_exec.input('post_date',db_sql.VarChar,post_date);
        query_exec.input('Introdcution',db_sql.VarChar,introduction);
        query_exec.query(insert_query,(query_error)=>{
                if(query_error){console.log("Insert_Data Query Failed!: "+query_error); returnback(false)}
                console.log("****For Debugging Insert_Data Query ******\n"+ insert_query+" For"+ post_id+user_id+post_type+post_date+introduction+"\n*************");  
                let query_exec2= new db_sql.Request();
                let insert_pic = `  
                update Account_Details
                set profile_pic=@profile_pic
                where user_id=@user_id;`;
                    query_exec2.input('profile_pic',db_sql.VarChar,profile_pic);
                    query_exec2.input('user_id',db_sql.Int,user_id);
                    query_exec2.query(insert_pic,(query_error2)=>{
                        if(query_error2){console.log("Update_Data Query Failed!: "+query_error2);returnback(false);}
                        console.log("****For Debugging Update_Data Query ******\n"+ insert_pic+" For"+ profile_pic+"\n*************");  
                        returnback(true);
                 })    
        });
    })
}
function Get_Post(user_id,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("\nDatabase SQL Connection failed!"); returnback(false);};
        let query_exec=new db_sql.Request();
        let get_post=`
            Select * from User_Post where user_id= @user_id order by post_date desc`;
        query_exec.input('user_id',db_sql.Int,user_id);
        query_exec.query(get_post,(query_error,res)=>{
            if(query_error){console.log("Get_Post Query Failed!: "+query_error); returnback(false);}
            console.log("****For Debugging Get_Post Query ******\n"+ get_post+" For"+ user_id+"\n*************");  
            returnback(res.recordset);
        })
    })
}
/***Main Post******************* */
function Get_PostAll(returnback){
        db_sql.connect(config,error=>{
                    if(error){console.log("Connection Error!\n"); returnback(true);}
                    let select_query=`
                    select post_id,User_Post.user_id,user_name,Like_count,Reply_count,post_date,profile_pic,post_type from User_Post
                    inner join Account_Details on User_Post.user_id=Account_Details.user_id;`
                    let query_exec=new db_sql.Request();
                query_exec.query(select_query,(query_error,res)=>{
                        if(query_error){console.log("Get_PostAll Query Failed!: "+query_error); returnback(true);}
                        console.log("****For Debugging Get_PostAll Query ******\n"+ select_query+"\n*************");  
                        returnback(res.recordset);
                })
        })
}

function Insert_Like(user_id,post_id,returnback){
     db_sql.connect(config,(error)=>{
        if(error){console.log("Connection Error!\n"); returnback(false);}
        let query_exec= new db_sql.Request();
        let like_query=`
        update User_Post
        set Like_count=Like_count+1
        where post_id = @post_id;
        insert into Like_Table(post_id,user_id)
        values (@post_id,@user_id)`;
        query_exec.input('post_id',db_sql.Int,post_id);
        query_exec.input('user_id',db_sql.Int,user_id);
        query_exec.query(like_query,(query_error,res)=>{
                if(query_error){console.log("Insert_Like Query Failed!: "+query_error); returnback(false);}else{
                console.log("****For Debugging Insert_Like Query ******\n"+ like_query+"\n*************"); 
                    returnback(true);
                }
        })
    })
}
function Like_Check(user_id,post_id,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("Connection Error!\n"); returnback(false);}
        let query_exec= new db_sql.Request();
        let like_check=`
            select user_id from Like_Table
            where user_id= @user_id and post_id=@post_id;`;
        query_exec.input('user_id',db_sql.Int,user_id);
        query_exec.input('post_id',db_sql.Int,post_id);
        query_exec.query(like_check,(query_error,res)=>{
            if(query_error){console.log("Like_Check Query Failed!: "+query_error); returnback(false);}else{
                console.log("****For Debugging Like_Check Query ******\n"+ like_check+"\n*************"); 
                    if(res.recordset.length<=0){
                        returnback(true);
                    }else{
                        returnback(false);
                    }
                }
        })
    })
}


function Comments_Return(post_id,returnback){
    db_sql.connect(config,(error)=>{
                if(error){console.log("Connection Error!\n"); returnback(false);}
                let query_exec=new db_sql.Request();
                let comment_query=`
                select post_id,comment_id,Comments_table.user_id,user_name,comment_text,comment_date,profile_pic from Comments_Table
                inner join Account_Details on Comments_table.user_id=Account_Details.user_id
                where post_id=@post_id
                order by comment_date desc;`;
                query_exec.input('post_id',db_sql.Int,post_id);
                query_exec.query(comment_query,(query_error,res)=>{
                    if(query_error){console.log("Comments_Return Query Failed!: "+query_error); returnback(false);}else{
                        console.log("****For Debugging Comments_Return Query ******\n"+ comment_query+" For: "+post_id+"\n*************"); 
                        returnback(res.recordset);
                    }
                })
    })

}
function Insert_Comment(post_id,user_id,comment_date,comment_text,returnback){
        db_sql.connect(config,(error)=>{
            if(error){console.log("Connection Error!\n"); returnback(false);}
            let query_exec=new db_sql.Request();
            let comment_insert= `
                Insert into Comments_table(post_id,user_id,comment_text,comment_date)
                values(@post_id,@user_id,@comment_text,@comment_date);
                update User_Post
                set Reply_Count=Reply_Count+1
                where post_id = @post_id;`;
                query_exec.input('post_id',db_sql.Int,post_id);
                query_exec.input('user_id',db_sql.Int,user_id);
                query_exec.input('comment_text',db_sql.VarChar,comment_text);
                query_exec.input('comment_date',db_sql.VarChar,comment_date);
                query_exec.query(comment_insert,(query_error,res)=>{
                    if(query_error){console.log("Insert_Comment Query Failed!: "+query_error); returnback(false);}else{
                        console.log("****For Debugging Insert_Comment Query ******\n"+ comment_insert+" For: "+post_id+user_id+comment_date+comment_text+"\n*************"); 
                        returnback(true);
                    }
                })
        })
}

function Search_Friend(user_name,current_user,returnback){
            db_sql.connect(config,(error)=>{
                if(error){console.log("Connection Error!\n"); returnback(false);}
                let query_exec=new db_sql.Request();
                let search_friendq=`
                select user_id,user_name,profile_pic from Account_Details
                where user_name like @user_name and user_id !=@user_id`;
                let user_append=user_name+'%';
                query_exec.input('user_name',db_sql.VarChar,user_append);
                query_exec.input('user_id',db_sql.Int,current_user);
                query_exec.query(search_friendq,(query_error,res)=>{
                    if(query_error){console.log("Search_Friend Query Failed!: "+query_error); returnback(false);}else{
                        console.log("****For Debugging Search_Friend Query ******\n"+ search_friendq+" For: "+user_name+current_user+"\n*************");
                        returnback(res.recordset);
                    }
                })
            })
}

function Addfriend(user_id,current_user,returnback){
        db_sql.connect(config,(error)=>{
            if(error){console.log("Connection Error!\n"); returnback(false);}
            let query_exec=new db_sql.Request();
            let add_friendq=`
            Insert into Friends(friend_id,user_id)
            values(@user_id,@current_id);
            Insert into Friends(friend_id,user_id)
            values(@current_id,@user_id);
            delete from Request_Table
            where request_sender=@user_id`;
            query_exec.input('user_id',db_sql.Int,user_id);
            query_exec.input('current_id',db_sql.Int,current_user);
            query_exec.query(add_friendq,(query_error,res)=>{
                if(query_error){console.log("Addfriend Query Failed!: "+query_error); returnback(false);}else{
                    console.log("****For Debugging Addfriend Query ******\n"+ add_friendq+" For: "+user_id+current_user+"\n*************");
                        returnback(true);
                }    
            })
        })
}

function Check_Friends(user_id,current_id,returnback){
        db_sql.connect(config,(error)=>{
            if(error){console.log("Connection Error!\n"); returnback(false);}
            let query_exec=new db_sql.Request();
            let check_frendq=`
                Select * from Request_Table
                where request_sender=@current_id and request_receiver=@user_id`;
            query_exec.input('current_id',db_sql.Int,current_id);
            query_exec.input('user_id',db_sql.Int,user_id);
            query_exec.query(check_frendq,(query_error,res)=>{
                if(query_error){console.log("Check_Friends Query Failed!: "+query_error); returnback(false);}else{
                    console.log("****For Debugging Check_Friends Query ******\n"+ check_frendq+" For: "+user_id+current_id+"\n*************");
                    if(res.recordset.length<=0){
                        returnback(false);
                    }
                }
            })
        })

}


function AddRequest(user_id,current_user,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("Connection Error!\n"); returnback(false);}
        let query_exec=new db_sql.Request();
        let add_requestq=`
        Insert into Request_Table(request_sender,request_receiver)
        values(@current_id,@user_id);`;
        query_exec.input('user_id',db_sql.Int,user_id);
        query_exec.input('current_id',db_sql.Int,current_user);
        query_exec.query(add_requestq,(query_error,res)=>{
            if(query_error){console.log("AddRequest Query Failed!: "+query_error); returnback(false);}else{
                console.log("****For Debugging AddRequest Query ******\n"+ add_requestq+" For: "+user_id+current_user+"\n*************");
                    returnback(true);
            }    
        })
    })
}

function GetRequest(current_user,returnback){   
    db_sql.connect(config,(error)=>{
        if(error){console.log("Connection Error!\n"); returnback(false);}
        let query_exec=new db_sql.Request();
        let getrequestq=`
        select user_name,profile_pic,request_sender from Request_Table
        inner join Account_Details on Account_Details.user_id=Request_Table.request_sender
        where request_receiver=@current_user;`;
        query_exec.input('current_user',db_sql.Int,current_user);
        query_exec.query(getrequestq,(query_error,res)=>{
            if(query_error){console.log("GetRequest Query Failed!: "+query_error); returnback(false);}else{
                console.log("****For Debugging GetRequest Query ******\n"+ getrequestq+" For: "+current_user+"\n*************");
                    returnback(res.recordset);
            }  
        })
    })
}

function RejectR(rejected_user,returnback){
            db_sql.connect(config,(error)=>{
                if(error){console.log("Connection Error!\n"); returnback(false);}
                let query_exec=new db_sql.Request();
                let rejected_rq=`
                    delete from Request_Table
                    where request_sender= @rejected_user;
                `;
                query_exec.input('rejected_user',db_sql.Int,rejected_user);
                query_exec.query(rejected_rq,(query_error,res)=>{
                    if(query_error){console.log("RejectR Query Failed!: "+query_error); returnback(false);}else{
                        console.log("****For Debugging RejectR Query ******\n"+ rejected_rq+" For: "+rejected_user+"\n*************");
                            returnback(true);
                    }  
                })
            })
}

function AcceptF(accepted_user,current_user,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("Connection Error!\n"); returnback(false);}
        let query_exec=new db_sql.Request();
        let acceptfq=`
            insert into Friends(friend_id,user_id)
            values(@accepted_user,@current_user);
        `;
        query_exec.input('current_user',db_sql.Int,current_user);
        query_exec.input('accepted_user',db_sql.Int,accepted_user);
        query_exec.query(acceptfq,(query_error,res)=>{
            if(query_error){console.log("AcceptF Query Failed!: "+query_error); returnback(false);}else{
                console.log("****For Debugging AcceptF Query ******\n"+ acceptfq+" For: "+accepted_user+current_user+"\n*************");
                    returnback(true);
            }  
        })
    })

}

function Get_Friends(user_id,returnback){
        db_sql.connect(config,(error)=>{
            if(error){console.log("Connection Error!\n"); returnback(false);}
            let query_exec=new db_sql.Request();
            let getfriendq=`
            select friend_id,user_name,profile_pic,online from Friends
            inner join Account_Details on Account_Details.user_id=Friends.friend_id
            where Friends.user_id=@user_id;`;
            query_exec.input('user_id',db_sql.Int,user_id);
            query_exec.query(getfriendq,(query_error,res)=>{
                if(query_error){console.log("Get_Friends Query Failed!: "+query_error); returnback(false);}else{
                    console.log("****For Debugging Get_Friends Query ******\n"+ getfriendq+" For: "+user_id+"\n*************");
                        returnback(res.recordset);
                } 
            })
        })
}

function Friend_Check(user_id,user_fid,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("Connection Error!\n"); returnback(false);}
        let query_exec=new db_sql.Request();
        let checkfriendq=`
        select friend_id,user_name,profile_pic,online from Friends
        inner join Account_Details on Account_Details.user_id=Friends.friend_id
        where Friends.user_id=@user_id and Friends.friend_id=@user_fid;`;
        query_exec.input('user_id',db_sql.Int,user_id);
        query_exec.input('user_fid',db_sql.Int,user_fid);
        query_exec.query(checkfriendq,(query_error,res)=>{
            if(query_error){console.log("Friend_Check Query Failed!: "+query_error); returnback(false);}else{
                console.log("****For Debugging Friend_Check Query ******\n"+ checkfriendq+" For: "+user_id+user_fid+"\n*************");
                    if(res.recordset.length>0){
                        returnback(true);
                    }else{
                        returnback(false);
                    }
            } 
        })
    })







}

function Remove_Friend(user_id,friend_id,returnback){
    db_sql.connect(config,(error)=>{
        if(error){console.log("Connection Error!\n"); returnback(false);}
        let query_exec=new db_sql.Request();
        let remfriendq=`
            delete from Friends
            where friend_id=@friend_id and user_id=@user_id
            delete from Friends
            where friend_id=@user_id and user_id=@friend_id`;
        query_exec.input('user_id',db_sql.Int,user_id);
        query_exec.input('friend_id',db_sql.Int,friend_id);
        query_exec.query(remfriendq,(query_error,res)=>{
            if(query_error){console.log("Remove_Friend Query Failed!: "+query_error); returnback(false);}else{
                console.log("****For Debugging Remove_Friend Query ******\n"+ remfriendq+" For: "+user_id+friend_id+"\n*************");
            } 
        })
    })







}
