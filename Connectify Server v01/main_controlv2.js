/*Required Files for the server*/
const connectify_express=require('express'); /*MAIN POST/GET Methods Handler*/
const connectify_server = connectify_express(); /*To utilize express functions */
const connectify_middle = require('body-parser'); /*Main Middle-ware to handle requests form website*/
const dynamic_url = require('cors'); /*Server and Website IP different handling  cross origin resource sharing*/
const path=require('path'); /*Path handling to redirect pages */
const o_stream =require('fs'); /*File Streaming for uploading text_files */
const multer =require('multer'); /*For uploading images on webpages*/
const cookie_parse=require('cookie-parser'); /*Saving Currently Logged in User Token*/

/*Server usage */
connectify_server.use(dynamic_url());
connectify_server.use(cookie_parse());
connectify_server.use(connectify_middle.urlencoded({extended:true}));
global.current_workspace=path.resolve(__dirname,'..');
connectify_server.use(connectify_express.static(current_workspace));

/*Global Variables*/
global.web_htmlcss_path=path.resolve(__dirname,'..','./web_htmlcss');
global.web_files_path=path.resolve(__dirname,'..','./web_files');
global.temp_user="default";
global.temp_id=0;
global.Saved_user=multer({dest: web_files_path+'/Post_files/'+temp_user+temp_id+'/'});

/*Server Routing Setting */
const server_ip = "192.168.1.8"; /*DO CHANGE WHEN URL/IPV4 CHANGES MANDATORY*/
const server_port = 5500; /*Server Listening */
connectify_server.listen(server_port,server_ip,(server_error)=>{
    console.log("***********************************");
    console.log("Connectify Server is now online!");
    console.log("Listening to "+server_ip+":"+server_port);
    console.log("***********************************");
})


/*GET REQUESTS FOR DEFAULT_WEBSITEURL*/
connectify_server.get('/',(required,sender)=>{
    sender.redirect('./www.connectify.com/');
 })
 connectify_server.get('/www.connectify.com/',(required,sender)=>{
     sender.sendFile(web_htmlcss_path+'/web_login.html');
 })

/*GET REQUESTS FOR HOME_PAGE*/
connectify_server.get('/www.connectify.com/:temp_user:temp_id/Home_page',(required,sender)=>{
    sender.sendFile(web_htmlcss_path+'/web_homepage.html');
})
connectify_server.get('/home_page',async(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    await new Promise((resolve,reject)=>{
        Insert_Online(user_id,(returnback)=>{
            if(returnback==false){console.log("****Remove_Online Query generally failed!***\n");}
        })
        resolve();
    })
    Get_Post(user_id,(user_data)=>{
        if(!user_data){console.log("\nGet_Post Query Error!\n");}else{
            sender.send(user_data);
        }
    })
})
connectify_server.get('/get_cookie',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    sender.send(Logged_Cookie);
})
connectify_server.get('/read_txt',(required,sender)=>{
    console.log("Reading post: "+required.query.post_id+" By: " +temp_user);
    let txt_path=path.join(web_files_path+'/Post_files/'+temp_user+temp_id+'/',required.query.post_id+".txt");
    o_stream.readFile(txt_path,'utf-8',(error,text)=>{
            if(error){console.log("Error! reading the file: "+error);}else{
            sender.send(text);
            }
    })
})
connectify_server.get('/Profile_pic',(required,sender)=>{
            Get_Profile(required.query.user_id,(record)=>{
                if(record==false){console.log("Get_Profile Query generally failed!: "+record);}else{
                    sender.send(record);}
            })
})

connectify_server.get('/get_requests',(required,sender)=>{
    let user_idf=required.query.user_id;
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    GetRequest(user_id,(returnback)=>{
        if(returnback==true){console.log("****GetRequest Query generally failed!***\n");}else{
            sender.send(returnback);}
    })
})
connectify_server.get('/reject_f',(required,sender)=>{
    let rejected_user=required.query.user_id;
    RejectR(rejected_user,(returnback)=>{
        if(returnback==false){console.log("****RejectR Query generally failed!***\n");}
    })
})
connectify_server.get('/Log_out',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    Remove_Online(user_id,(returnback)=>{
        if(returnback==false){console.log("****Remove_Online Query generally failed!***\n");}else{
            sender.redirect('/');
        }
    })
})




/*GET REQUESTS FOR PROFILE_EDITING PAGE*/
connectify_server.get('/www.connectify.com/:temp_user:temp_id/Profile_Edit',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    Saved_user=multer({dest: web_files_path+'/Post_files/'+user_name+user_id+'/'});
    sender.sendFile(web_htmlcss_path+'/web_pedit.html');
})
connectify_server.get('/Profile_Edit',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    sender.redirect('/www.connectify.com/'+temp_user+temp_id+'/Profile_Edit');

})
/*GET REQUESTS FOR POST_PAGE*/
connectify_server.get('/Post_Page',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;    
    sender.redirect('/www.connectify.com/'+temp_user+temp_id+'/Post_page')
})
connectify_server.get('/www.connectify.com/:temp_user:temp_id/Post_page',(required,sender)=>{
    sender.sendFile(web_htmlcss_path+'/web_postpage.html');
})
connectify_server.get('/get_pdata',(required,sender)=>{
    Get_PostAll((returnback)=>{
            if(returnback==true){console.log("****Get_PostData Query generally failed!***\n");}else{
                sender.send(returnback);
            }
    });
})
connectify_server.get('/read_txtp',(required,sender)=>{
console.log("Reading post: "+required.query.post_id +" By: "+required.query.user_name);
let txt_path=path.join(web_files_path+'/Post_files/'+required.query.user_name+required.query.user_id+'/',required.query.post_id+".txt");
            o_stream.readFile(txt_path,'utf-8',(error,text)=>{
                if(error){console.log("Error! reading the file: "+error);}
                sender.send(text);
            })
})
connectify_server.get('/Like_Request',async (required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;  
    console.log(required.query.post_id);
    post_id=required.query.post_id;
    await new Promise((resolve,reject)=>{
        Like_Check(user_id,post_id,(returnback)=>{
            if(returnback==false){
                console.log("User already has liked it!");
            }else{
                Insert_Like(user_id,post_id,(returnback)=>{
                    if(returnback==false){console.log("Insert_Like Generally Query failed!");}
            })
            }
        })
        resolve();
    })
})
connectify_server.get('/Homep',(required,sender)=>{
    sender.redirect('/www.connectify.com/'+temp_id+temp_user+'/Home_page');

})
connectify_server.get('/get_comments',(required,sender)=>{
    let post_id=required.query.post_id;
    Comments_Return(post_id,(returnback)=>{
        if(returnback==true){console.log("****Comments_Return Query generally failed!***\n");}else{
            sender.send(returnback);}
    })
})

connectify_server.get('/get_userf',(required,sender)=>{
    let user_name=required.query.user_name;
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_namec=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_namec;  
    Search_Friend(user_name,temp_id,(returnback)=>{
            if(returnback==false){console.log("****Search_Friend Query generally failed!***\n");}else{
                sender.send(returnback);
            }

    })
})

connectify_server.get('/add_request', async (required,sender)=>{
    let user_idf=required.query.user_id;
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    await new Promise((resolve,reject)=>{
        Check_Friends(user_idf,user_id,(returnback)=>{
            if(returnback==true){
                console.log("\nAlready Sent a request!\n");
                resolve();
            }else if(returnback==false){
                  Friend_Check(user_id,user_idf,(friend)=>{
                    if(friend){
                        console.log('\nAlready Friends!\n');
                        resolve();
                    }else{
                        AddRequest(user_idf,user_id,(returnback2)=>{
                            if(returnback2==false){console.log("****AddRequest Query generally failed!***\n");}
                            resolve();
                        })
                        
                    }
                    
                  })     
                }
        })
       resolve();
    })
})

connectify_server.get('/add_friend',(required,sender)=>{
    let user_idf=required.query.user_id;
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    Addfriend(user_idf,user_id,(returnback)=>{
        if(returnback==false){console.log("****Addfriend Query generally failed!***\n");}
    })
})

connectify_server.get('/get_fdata',(required,sender)=>{
    console.log("RECEIVING\n");
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    Get_Friends(user_id,(returnback)=>{
        if(returnback==false){console.log("****Get_Friends Query generally failed!***\n");}else{
            sender.send(returnback);
        }
    })
})
connectify_server.get('/remove_friend',(required,sender)=>{
    let friend_id =required.query.friend_id;
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    Remove_Friend(user_id,friend_id,(returnback)=>{
        if(returnback==false){console.log("****Get_Friends Query generally failed!***\n");}
    })
})
/*IMPORTING FROM CONNECTIFY DATABASE SQL FILE*/
const {
    Login_Check,
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
} = require("./Connectify_Database.js");

/*POST REQUESTS FOR LOGIN/REG_PAGE*/
connectify_server.post('/www.connectify.com/Login_Check',(required,sender)=>{
    var email=required.body.email; 
    var password=required.body.password; 
    var check_flag=0;
     /*Running Login Check Query */
     Login_Check(email,password,(record)=>{
             if(record==false){console.log("\nLogin Query generally failed!\n");}
             check_flag=record.map(lflag_obj => lflag_obj.lflag);
             if(check_flag[0]==1){
                 console.log("For Debugging purpose Sucess Login with email: "+email+" Password: "+password);
                  /*Running Get_User Check Query */
                 Get_User(email,password,(record)=>{
                     if(record==false){console.log("Get_User Query Generally faield!");}
                     let current_name=record.map(c_user_obj=>c_user_obj.user_name);
                     let current_id = record.map(c_user_obj=>c_user_obj.user_id);
                     temp_user=current_name;
                     temp_id=current_id;
                     /*MAKING COOKIE*/
                     sender.cookie('Logged_in_User',JSON.stringify({User:current_name,User_ID:current_id}),{maxAge:7200000,httpOnly: true});
                     sender.redirect('/www.connectify.com/'+temp_user+temp_id+'/Home_Page');
                     
                 })
             }else{
                 console.log("For Debugging purpose Failed Login with email: "+email+" Password: "+password+ "\nNO USER FOUND!");
                 sender.redirect('/www.connectify.com/');
             }
         })
})
connectify_server.post('/www.connectify.com/register_submission',(required,sender)=>{
 var user_name=required.body.username; 
 var email=required.body.email; 
 var password=required.body.password; 
 var check_flag=0;
 var sucess_flag=false;
 Registration_Check(user_name,email,(record)=>{
     if(record==false){console.log("Registration_Check Query generally failed!\n");}
     check_flag=record.map(rflag_obj => rflag_obj.rflag);
     if(check_flag[0]==1){
         sucess_flag=true;
         console.log("User already exists!\n");
     }else{
         sucess_flag=false;
         Registration(user_name,email,password,(sucess)=>{
             if(!sucess){console.log("Registration Query generally failed!\n");sender.redirect('/www.connectify.com/');}else{
             Get_User(email,password,(record)=>{
                 if(record==false){console.log("Get_User Query generally faield!\n");}
                 let current_name=record.map(c_user_obj=>c_user_obj.user_name);
                 let current_id = record.map(c_user_obj=>c_user_obj.user_id);
                 sender.cookie('Logged_in_User',JSON.stringify({User:current_name,User_ID:current_id}),{maxAge:7200000,httpOnly: true});
                 temp_user=current_name;
                 temp_id=current_id;
                 console.log("Successful Register!\n");
                 sender.redirect('/www.connectify.com/'+temp_user+temp_id+'/Profile_Edit');
             })
            }
         })
         
        
     }
 })
})

/*POST REQUESTS FOR PROFILEEDIT_PAGE*/
connectify_server.post('/www.connectify.com/:temp_user:temp_id/submit_profile_edit',Saved_user.fields([{name: 'profile-image-upload',maxCount: 1},{name:'post-image-upload',maxCount: 1}]), async (required,sender)=>{
    let user_photo=required.files['profile-image-upload'];
    let user_post_img=required.files['post-image-upload'];
    let user_intro=required.body.introduction;
    let user_post_text=required.body.new_post;
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    var user_name=Logged_Cookie.User[0];
    let rand_id=(Math.floor(Math.random()*(200-0)+1)+1);
    let profile_pic='default';
/*CHECKING IF PROFILE_IMG input is left empty*/
    await new Promise((resolve,reject)=>{
            Get_Profile(user_id,(returnback)=>{
                    if(returnback==false){console.log("Get_Profile Query generally failed!\n");sender.redirect('/www.connectify.com/');}else{
                        if(returnback[0].profile_pic=='default'){
                            profile_pic='default';}
                        else{profile_pic=returnback[0].profile_pic;}  
                } 
            })
            resolve();
    });
/*CHECKING IF INTRO input is left empty*/
    await new Promise((resolve,reject)=>{
        Get_Post(user_id,(returnback)=>{
        if(returnback==false){console.log("Get_Post Query generally failed!\n");}else{
           if(returnback.length<=0){
                if(!user_intro || user_intro==null || user_intro==''){
                    user_intro='Hello!';
                    resolve(); }}
           else{
                if(!user_intro || user_intro==null || user_intro==''){
                    user_intro=returnback[0].Introduction;
                    resolve();}}
        }
           resolve();    
        })
     
});
/*IF NULL Profile_Picture*/
    if(((user_photo==null || !user_photo) && profile_pic=='default')){
        if(user_post_text){
            let text_name=rand_id+'.txt';
            let text_path=path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',text_name);
            o_stream.writeFile(text_path,user_post_text,(error)=>{
            if(error){console.log("Writing Text_file failed!: "+error);}else{
            let post_type=".txt";
            let currentDate = new Date().toISOString().slice(0, 10);
            console.log("Uploaded Profile Pic:"+profile_pic); 
            Insert_Data(rand_id,user_id,post_type,currentDate,user_intro,profile_pic,(error)=>{
                if(error==false){console.log("Insert_Data Query Failed!\n");}else{
                sender.redirect('/www.connectify.com/'+user_name+user_id+'/Home_page');}
            })
        }
        })
        }else{
            let um=path.extname(user_post_img[0].originalname);
            let img_name=rand_id+um;
            o_stream.rename(user_post_img[0].path,path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',img_name),(error)=>{
                if(error){console.log("Error uploading image picture!: "+error);}else{
                    let currentDate = new Date().toISOString().slice(0, 10); 
                    post_type=um;
                    let profile_pic=user_name+upextension;
                    console.log("Uploaded Profile Pic:"+profile_pic);
                    Insert_Data(rand_id,user_id,post_type,currentDate,user_intro,profile_pic,(error)=>{
                        if(error==false){console.log("\nInsert Data Query Failed!\n");}
                        sender.redirect('/www.connectify.com/'+user_name+user_id+'/Home_page');
                    })
                    }
                })
        }
    }
/*NOT NULL Profile_Picture*/
    else{
    let upextension;
    let newp;
        if(user_photo==null || !user_photo){
        upextension=path.extname(profile_pic);
        await new Promise((resolve,reject)=>{
            o_stream.readFile(web_files_path+'/Post_Files/'+user_name+user_id+'/'+profile_pic,(error,img)=>{
                if(error){console.log("Error Reading Img!"+error);}else{
                    uphpic=img;
                    uphpic.path=web_files_path+'/Post_Files/'+user_name+user_id+'/'+profile_pic;
                    resolve();}
                resolve();
            })
        });
        } else{
            uphpic=user_photo[0];
            upextension=path.extname(uphpic.originalname);
            profile_pic =user_name+upextension;}
    if(user_post_text){
    o_stream.rename(uphpic.path,path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',user_name+upextension),(error)=>{
        if(error){console.log("Error uploading profile picture!: "+error);}else{
        let text_name=rand_id+'.txt';
        let text_path=path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',text_name);
        o_stream.writeFile(text_path,user_post_text,(error)=>{
                if(error){console.log("Error writing into text!"+error);}else{
                let post_type=".txt";
                let currentDate = new Date().toISOString().slice(0, 10); 
                
                console.log("\n Profile pic: "+profile_pic);
                Insert_Data(rand_id,user_id,post_type,currentDate,user_intro,profile_pic,(error)=>{
                    if(error==false){console.log("\nInsert Data Query Failed!\n");}
                    sender.redirect('/www.connectify.com/'+user_name+user_id+'/Home_page');
                })
            }
         })
        }
        })
    } else{
        o_stream.rename(uphpic.path,path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',user_name+upextension),(error)=>{
            if(error){console.log("Error uploading profile picture!: "+error);}else{
            let um=path.extname(user_post_img[0].originalname);
            let img_name=rand_id+um;
            o_stream.rename(user_post_img[0].path,path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',img_name),(error)=>{
                if(error){
                    console.log("\nerror uploading image picture!\n");
                }else{
                    let currentDate = new Date().toISOString().slice(0, 10); 
                    post_type=um;
                    let profile_pic=user_name+upextension;
                    console.log("\n Profile pic: "+profile_pic);
                    Insert_Data(rand_id,user_id,post_type,currentDate,user_intro,profile_pic,(error)=>{
                        if(error==false){console.log("\nInsert Data Query Failed!\n");}
                        sender.redirect('/www.connectify.com/'+user_name+user_id+'/Home_page');
                    })
                    }
                })
                }
            })
    }
}

})

/*POST REQUESTS FOR POST_PAGE*/
connectify_server.post('/submit_comment',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;  
    let post_id=required.query.post_id;
    let comment_text=required.query.comment_text;
    console.log("Inserting Comment: "+comment_text);
    let currentDate = new Date().toISOString().slice(0, 10);
    Insert_Comment(post_id,temp_id,currentDate,comment_text,(returnback)=>{
        if(returnback==false){console.log("Insert_Comment Query generally failed!\n");}else{
            sender.redirect(required.get('refrer'));
        }
    })
})